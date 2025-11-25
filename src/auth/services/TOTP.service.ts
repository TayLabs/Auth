import { authenticator } from 'otplib';
import type { UUID } from 'node:crypto';
import { db } from '@/config/db';
import { totpTokenTable } from '@/config/db/schema/totpToken.schema';
import { eq, getTableColumns } from 'drizzle-orm';
import { decrypt, encrypt } from '../utils/encryption.utils';
import HttpStatus from '@/types/HttpStatus.enum';
import AppError from '@/types/AppError';
import QRCode from 'qrcode';

export default class TOTP {
	private _userId: UUID;

	constructor(userId: UUID) {
		this._userId = userId;
	}

	public async create() {
		const secret = authenticator.generateSecret();
		const otpAuthUri = authenticator.keyuri('email', 'TayLabAuth', secret);

		const qrCode = await QRCode.toDataURL(otpAuthUri);

		const { content, iv, authTag } = encrypt(secret);

		const { encryptedSecret, encryptionAuthTag, encryptionIv, ...columns } =
			getTableColumns(totpTokenTable);
		const totpTokenRecord = (
			await db
				.insert(totpTokenTable)
				.values({
					userId: this._userId,
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
		const totpTokens = await db
			.select()
			.from(totpTokenTable)
			.where(eq(totpTokenTable.userId, this._userId));

		let matchId: UUID | undefined = undefined;
		for (const totpToken of totpTokens) {
			const secret = decrypt({
				content: totpToken.encryptedSecret,
				iv: totpToken.encryptionIv,
				tag: totpToken.encryptionAuthTag,
			});

			if (authenticator.check(code.toString(), secret)) {
				matchId = totpToken.id;

				await db.update(totpTokenTable).set({
					isVerified: true,
					lastUsedAt: new Date(),
				});

				break; // if there is a match, break the loop
			}
		}

		if (!matchId) {
			throw new AppError('Invalid code', HttpStatus.BAD_REQUEST);
		} else {
			return {
				id: matchId,
			};
		}
	}

	public async remove(totpTokenId: UUID) {
		await db.delete(totpTokenTable).where(eq(totpTokenTable.id, totpTokenId));
	}
}
