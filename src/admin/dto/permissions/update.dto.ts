import z from 'zod';
import type { ResponseBody } from '@/types/ResponseBody';
import type { Permission } from '@/admin/interfaces/permission.interface';

const updatePermissionBodySchema = z.object({
  name: z
    .string('Must be a valid string')
    .min(1, 'Too short')
    .max(128, 'Too long'),
});

type UpdatePermissionReqBody = z.infer<typeof updatePermissionBodySchema>;
type UpdatePermissionResBody = ResponseBody<{
  permission: Permission;
}>;

export {
  updatePermissionBodySchema,
  type UpdatePermissionReqBody,
  type UpdatePermissionResBody,
};
