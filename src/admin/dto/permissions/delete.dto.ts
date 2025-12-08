import z from 'zod';
import type { ResponseBody } from '@/types/ResponseBody';
import type { Permission } from '@/admin/interfaces/permission.interface';

const deletePermissionParamSchema = z.object({
  name: z
    .string('Must be a valid string')
    .min(1, 'Too short')
    .max(128, 'Too long'),
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
