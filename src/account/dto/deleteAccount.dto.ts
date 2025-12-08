import { ResponseBody } from '@/types/ResponseBody';
import type { UUID } from 'node:crypto';
import z from 'zod';

const deleteAccountParamsSchema = z.object({
  userId: z.uuid('Must be a valid uuid').transform((str) => str as UUID),
});

type DeleteAccountReqParams = z.infer<typeof deleteAccountParamsSchema>;
type DeleteAccountResBody = ResponseBody<{
  user: {
    id: UUID;
  };
}>;

export {
  deleteAccountParamsSchema,
  type DeleteAccountReqParams,
  type DeleteAccountResBody,
};
