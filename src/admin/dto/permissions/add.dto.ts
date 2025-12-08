import z from 'zod';
import type { ResponseBody } from '@/types/ResponseBody';
import type { Permission } from '@/admin/interfaces/permission.interface';

const addPermissionBodySchema = z.object({
  resource: z
    .string('Must be a valid string')
    .min(1, 'Too short')
    .max(128, 'Too long'),
  action: z
    .string('Must be a valid string')
    .min(1, 'Too short')
    .max(128, 'Too long'),
});

type AddPermissionReqBody = z.infer<typeof addPermissionBodySchema>;
type AddPermissionResBody = ResponseBody<{
  permission: Permission;
}>;

export {
  addPermissionBodySchema,
  type AddPermissionReqBody,
  type AddPermissionResBody,
};
