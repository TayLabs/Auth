import type { UUID } from 'node:crypto';

export type TOTPToken = {
  id: UUID;
  userId: UUID;
  isVerified: boolean;
  lastUsedAt: null | Date;
  createdAt: Date;
};
