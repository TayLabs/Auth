import z from 'zod';
import type { ResponseBody } from '@/types/ResponseBody';
import type { Role } from '@/admin/interfaces/role.interface';

const updateRoleBodySchema = z.object({
  name: z
    .string('Must be a valid string')
    .min(1, 'Too short')
    .max(128, 'Too long'),
});

type UpdateRoleReqBody = z.infer<typeof updateRoleBodySchema>;
type UpdateRoleResBody = ResponseBody<{
  role: Role;
}>;

export { updateRoleBodySchema, type UpdateRoleReqBody, type UpdateRoleResBody };
