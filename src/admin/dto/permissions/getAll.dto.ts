import type { ResponseBody } from '@/types/ResponseBody';
import type { Permission } from '@/admin/interfaces/permission.interface';

type GetAllPermissionsResBody = ResponseBody<{
  permissions: Permission[];
}>;

export { type GetAllPermissionsResBody };
