import z from 'zod';
import type { ResponseBody } from '@/types/ResponseBody';
import type { Role } from '@/admin/interfaces/role.interface';

const getRoleParamSchema = z.object({
  name: z
    .string('Must be a valid string')
    .min(1, 'Too short')
    .max(128, 'Too long'),
});

type GetRoleReqParams = z.infer<typeof getRoleParamSchema>;
type GetRoleResBody = ResponseBody<{
  role: Role;
}>;

export { getRoleParamSchema, type GetRoleReqParams, type GetRoleResBody };
