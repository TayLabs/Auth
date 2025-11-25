import env from '@/types/env';
import crypto from 'node:crypto';

const key = Buffer.from(env.TOTP_ENCRYPT_KEY, 'base64');

export function encrypt(text: string) {
	const iv = crypto.randomBytes(12);

	const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

	const encrypted = Buffer.concat([
		cipher.update(text, 'utf-8'),
		cipher.final(),
	]);

	const authTag = cipher.getAuthTag();

	return {
		iv: iv,
		content: encrypted,
		authTag: authTag,
	};
}

export function decrypt(encrypted: {
	iv: Buffer<ArrayBufferLike>;
	content: Buffer<ArrayBufferLike>;
	tag: Buffer<ArrayBufferLike>;
}) {
	const decipher = crypto.createDecipheriv('aes-256-gcm', key, encrypted.iv);
	decipher.setAuthTag(encrypted.tag);

	const decrypted = Buffer.concat([
		decipher.update(encrypted.content),
		decipher.final(),
	]);

	return decrypted.toString('utf8');
}
