import z from 'zod';
import type { ResponseBody } from '@/types/ResponseBody';
import type { Role } from '@/admin/interfaces/role.interface';
import type { UUID } from 'node:crypto';

const getRoleParamSchema = z.object({
  roleId: z.uuid('Must be a valid UUID').transform((str) => str as UUID),
});

type GetRoleReqParams = z.infer<typeof getRoleParamSchema>;
type GetRoleResBody = ResponseBody<{
  role: Role;
}>;

export { getRoleParamSchema, type GetRoleReqParams, type GetRoleResBody };
