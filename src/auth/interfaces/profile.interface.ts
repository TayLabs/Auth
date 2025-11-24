import { UUID } from 'node:crypto';

export type Profile = {
	id: UUID;
	username: string;
	firstName: string;
	lastName: string;
	avatarUrl: string | null;
	bio: string | null;
	updatedAt: Date;
};
