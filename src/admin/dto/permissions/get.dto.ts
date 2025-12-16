import z from 'zod';
import type { ResponseBody } from '@/types/ResponseBody';
import type { Permission } from '@/admin/interfaces/permission.interface';
import type { UUID } from 'node:crypto';

const getPermissionParamSchema = z.object({
  serviceId: z.uuid('Must be a valid UUID').transform((str) => str as UUID),
  permissionId: z.uuid('Must be a valid UUID').transform((str) => str as UUID),
});

type GetPermissionReqParams = z.infer<typeof getPermissionParamSchema>;
type GetPermissionResBody = ResponseBody<{
  permission: Permission;
}>;

export {
  getPermissionParamSchema,
  type GetPermissionReqParams,
  type GetPermissionResBody,
};
