import z from 'zod';
import type { ResponseBody } from '@/types/ResponseBody';
import type { Permission } from '@/admin/interfaces/permission.interface';
import type { UUID } from 'node:crypto';

const updatePermissionParamSchema = z.object({
  serviceId: z.uuid('Must be a valid UUID').transform((str) => str as UUID),
  permissionId: z.uuid('Must be a valid UUID').transform((str) => str as UUID),
});

const updatePermissionBodySchema = z.object({
  resource: z
    .string('Must be a valid string')
    .min(1, 'Too short')
    .max(128, 'Too long'),
  action: z
    .string('Must be a valid string')
    .min(1, 'Too short')
    .max(128, 'Too long'),
});

type UpdatePermissionReqParams = z.infer<typeof updatePermissionParamSchema>;
type UpdatePermissionReqBody = z.infer<typeof updatePermissionBodySchema>;
type UpdatePermissionResBody = ResponseBody<{
  permission: Permission;
}>;

export {
  updatePermissionParamSchema,
  updatePermissionBodySchema,
  type UpdatePermissionReqParams,
  type UpdatePermissionReqBody,
  type UpdatePermissionResBody,
};
