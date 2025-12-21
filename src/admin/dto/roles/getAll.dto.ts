import type { ResponseBody } from '@/types/ResponseBody';
import type { Role } from '@/admin/interfaces/Role.interface';

type GetAllRolesResBody = ResponseBody<{
	roles: Role[];
}>;

export { type GetAllRolesResBody };
