import type { UUID } from 'node:crypto';

export type Permission = {
	id: UUID;
	serviceId: UUID;
	key: string;
	description: string | null;
};
