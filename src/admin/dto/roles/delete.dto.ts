import z from 'zod';
import type { ResponseBody } from '@/types/ResponseBody';
import type { UUID } from 'node:crypto';

const deleteRoleParamSchema = z.object({
  name: z
    .string('Must be a valid string')
    .min(1, 'Too short')
    .max(128, 'Too long'),
});

type DeleteRoleReqParams = z.infer<typeof deleteRoleParamSchema>;
type DeleteRoleResBody = ResponseBody<{
  role: {
    id: UUID;
    name: string;
  };
}>;

export {
  deleteRoleParamSchema,
  type DeleteRoleReqParams,
  type DeleteRoleResBody,
};
