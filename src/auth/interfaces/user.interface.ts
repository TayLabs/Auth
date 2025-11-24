import { UUID } from 'node:crypto';

export type User = {
	id: UUID;
	email: string;
	emailVerified: boolean;
	phoneNumber?: string;
	phoneNumberVerified: boolean;
	totpEnabled: boolean;
	createdAt: Date;
};
