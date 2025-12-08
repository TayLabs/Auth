import type { ResponseBody } from '@/types/ResponseBody';
import type { Role } from '@/admin/interfaces/role.interface';

type GetAllRolesResBody = ResponseBody<{
  roles: Role[];
}>;

export { type GetAllRolesResBody };
