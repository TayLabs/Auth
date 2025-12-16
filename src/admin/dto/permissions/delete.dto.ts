import z from 'zod';
import type { ResponseBody } from '@/types/ResponseBody';
import type { Permission } from '@/admin/interfaces/permission.interface';
import type { UUID } from 'node:crypto';

const deletePermissionParamSchema = z.object({
  serviceId: z.uuid('Must be a valid UUID').transform((str) => str as UUID),
  permissionId: z.uuid('Must be a valid UUID').transform((str) => str as UUID),
});

type DeletePermissionReqParams = z.infer<typeof deletePermissionParamSchema>;
type DeletePermissionResBody = ResponseBody<{
  permission: Permission;
}>;

export {
  deletePermissionParamSchema,
  type DeletePermissionReqParams,
  type DeletePermissionResBody,
};
