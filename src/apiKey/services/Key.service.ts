import { randomBytes, type UUID } from 'node:crypto';
import { hashAsync, verifyAsync } from '../utils/hash.util';
import { apiKeyTable } from '@/config/db/schema/apiKey.schema';
import { db } from '@/config/db';
import { eq } from 'drizzle-orm';
import AppError from '@/types/AppError';
import HttpStatus from '@/types/HttpStatus.enum';
import parseTTL from '@/auth/utils/parseTTL.utils';
import env from '@/types/env';
import { serviceTable } from '@/config/db/schema/service.schema';

export default class Key {
  private _serviceName: string;
  private _keyId?: UUID;

  constructor(serviceName: string, keyId?: UUID) {
    this._serviceName = serviceName;
    this._keyId = keyId;
  }

  private async getService(): Promise<typeof serviceTable.$inferSelect> {
    const result = (
      await db
        .select()
        .from(serviceTable)
        .where(eq(serviceTable.name, this._serviceName))
    )[0];

    if (!result) {
      throw new AppError(
        'Service with that name does not exist',
        HttpStatus.BAD_REQUEST
      );
    }

    return result;
  }

  public async create(): Promise<{
    key: string;
    keyRecord: typeof apiKeyTable.$inferSelect;
  }> {
    const key = randomBytes(32).toString('hex'); // len: 64
    const keyHash = await hashAsync(key);

    const service = await this.getService();

    const keyRecord = (
      await db
        .insert(apiKeyTable)
        .values({
          serviceId: service.id,
          keyHash,
          keyLastFour: key.substring(key.length - 4),
          expiresAt: new Date(
            Date.now() + parseTTL(env.API_KEY_TTL).milliseconds
          ),
        })
        .returning()
    )[0];

    return {
      key,
      keyRecord,
    };
  }

  public async verify(key: string): Promise<boolean> {
    const service = await this.getService();

    const keyRecords = await db
      .select()
      .from(apiKeyTable)
      .where(eq(apiKeyTable.serviceId, service.id));

    for (const keyRecord of keyRecords) {
      if (keyRecord.expiresAt >= new Date()) {
        if (await verifyAsync(keyRecord.keyHash, key)) {
          return true;
        }
      } else {
        await db.delete(apiKeyTable).where(eq(apiKeyTable.id, keyRecord.id)); // delete expired key
      }
    }

    return false;
  }

  public async remove(): Promise<typeof apiKeyTable.$inferSelect> {
    if (!this._keyId) {
      throw new AppError('Please specify a key id', HttpStatus.BAD_REQUEST);
    }

    const result = (
      await db
        .delete(apiKeyTable)
        .where(eq(apiKeyTable.id, this._keyId))
        .returning()
    )[0];

    return result;
  }
}
