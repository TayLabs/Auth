import { ResponseBody } from '@/types/ResponseBody';
import type { UUID } from 'node:crypto';
import z from 'zod';

type DeleteAccountResBody = ResponseBody<{
  user: {
    id: UUID;
  };
}>;

export { type DeleteAccountResBody };
