import { UUID } from 'node:crypto';

export type User = {
	id: UUID;
	email: string;
	emailVerified: boolean;
	passwordHash?: string;
	phoneNumber?: string;
	phoneNumberVerified: boolean;
	totpEnabled: boolean;
	createdAt: Date;
};
