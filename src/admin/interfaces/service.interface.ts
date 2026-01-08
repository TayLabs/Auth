import type { UUID } from 'node:crypto';
import type { Permission } from './permission.interface';

export type Service = {
  id: UUID;
  name: string;
  isExternal: boolean;
  permissions: Permission[];
};
