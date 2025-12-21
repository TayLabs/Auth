import type { UUID } from 'node:crypto';
import type { Permission } from './Permission.interface';

export type Role = {
	id: UUID;
	name: string;
	assignToNewUser: boolean;
	permissions: Permission[];
};
