import { authenticator } from 'otplib';
import type { Request } from 'express';
import type { UUID } from 'node:crypto';
import { db } from '@/config/db';
import { totpTokenTable } from '@/config/db/schema/totpToken.schema';
import { and, eq, getTableColumns } from 'drizzle-orm';
import { decrypt, encrypt } from '../utils/encryption.utils';
import HttpStatus from '@/types/HttpStatus.enum';
import AppError from '@/types/AppError';
import QRCode from 'qrcode';
import { userTable } from '@/config/db/schema/user.schema';

export default class TOTP {
  private _req: Request;

  constructor(req: Request) {
    this._req = req;
  }

  public async getAll() {
    const { encryptedSecret, encryptionAuthTag, encryptionIv, ...columns } =
      getTableColumns(totpTokenTable);
    const results = await db
      .select(columns)
      .from(totpTokenTable)
      .where(eq(totpTokenTable.userId, this._req.user.id));

    return results;
  }

  public async create() {
    const user = (
      await db
        .select({ email: userTable.email })
        .from(userTable)
        .where(eq(userTable.id, this._req.user.id))
    )[0];

    const secret = authenticator.generateSecret(20);
    const otpAuthUri = authenticator.keyuri(user.email, 'TayLabAuth', secret);

    const qrCode = await QRCode.toDataURL(otpAuthUri);

    const { content, iv, authTag } = encrypt(secret);

    const { encryptedSecret, encryptionAuthTag, encryptionIv, ...columns } =
      getTableColumns(totpTokenTable);
    const totpTokenRecord = (
      await db
        .insert(totpTokenTable)
        .values({
          userId: this._req.user.id,
          encryptedSecret: content,
          encryptionIv: iv,
          encryptionAuthTag: authTag,
        })
        .returning(columns)
    )[0];

    return {
      totpTokenRecord,
      qrCode,
    };
  }

  public async verify(code: number) {
    const totpToken = (
      await db
        .select()
        .from(totpTokenTable)
        .where(eq(totpTokenTable.id, this._req.params.totpTokenId as UUID))
    )[0];

    if (totpToken.isVerified) {
      throw new AppError('Token is already verified', HttpStatus.BAD_REQUEST);
    }

    // Decrypt the stored secret
    const secret = decrypt({
      content: totpToken.encryptedSecret,
      iv: totpToken.encryptionIv,
      tag: totpToken.encryptionAuthTag,
    });

    if (authenticator.check(code.toString(), secret)) {
      // Update token record to isVerified = true
      await db.update(totpTokenTable).set({
        isVerified: true,
        lastUsedAt: new Date(),
      });
    } else {
      throw new AppError('Invalid code', HttpStatus.BAD_REQUEST);
    }
  }

  public async validate(code: number) {
    const totpTokens = await db
      .select()
      .from(totpTokenTable)
      .where(
        and(
          eq(totpTokenTable.userId, this._req.user.id),
          eq(totpTokenTable.isVerified, true)
        )
      );

    let matchId: UUID | undefined = undefined;
    for (let i = 0; i < totpTokens.length; i++) {
      const totpToken = totpTokens[i];

      const secret = decrypt({
        content: totpToken.encryptedSecret,
        iv: totpToken.encryptionIv,
        tag: totpToken.encryptionAuthTag,
      });

      if (authenticator.check(code.toString(), secret)) {
        matchId = totpToken.id;

        // Update lastUsedAt date
        await db.update(totpTokenTable).set({
          lastUsedAt: new Date(),
        });

        break; // if there is a match, break the loop
      }
    }

    if (matchId) {
      return {
        id: matchId,
      };
    } else {
      throw new AppError('Invalid code', HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Removes a registered TOTP token
   * @param totpTokenId UUID
   */
  public async remove(totpTokenId: UUID) {
    const result = (
      await db
        .delete(totpTokenTable)
        .where(eq(totpTokenTable.id, totpTokenId))
        .returning({ id: totpTokenTable.id })
    )[0];

    if (!result) {
      throw new AppError(
        'Token with that Id does not exist',
        HttpStatus.NOT_FOUND
      );
    }

    // Auto toggle it for the user if it's the last option remaining
    await db.transaction(async (tx) => {
      const tokens = await tx
        .select({ id: totpTokenTable.id })
        .from(totpTokenTable)
        .where(eq(totpTokenTable.userId, this._req.user.id));

      if (tokens.length === 0) {
        await tx
          .update(userTable)
          .set({
            twoFactorEnabled: false,
          })
          .where(eq(userTable.id, this._req.user.id));
      }
    });

    return result;
  }
}
