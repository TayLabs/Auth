import type { UUID } from 'node:crypto';

export type Permission = {
  id: UUID;
  resource: string;
  action: string;
};
