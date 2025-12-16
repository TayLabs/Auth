import { UUID } from 'node:crypto';

export type Service = {
  id: UUID;
  name: string;
};
