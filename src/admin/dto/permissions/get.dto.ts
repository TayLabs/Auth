import z from 'zod';
import type { ResponseBody } from '@/types/ResponseBody';
import type { Permission } from '@/admin/interfaces/permission.interface';

const getPermissionParamSchema = z.object({
  name: z
    .string('Must be a valid string')
    .min(1, 'Too short')
    .max(128, 'Too long'),
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
