import type { UUID } from 'node:crypto';
import type { Permission } from './permission.interface';

export type Role = {
  id: UUID;
  name: string;
  assignToNewUser: boolean;
  isExternal: boolean;
  permissions: Permission[];
};
