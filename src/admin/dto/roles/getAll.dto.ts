import type { ResponseBody } from '@/types/ResponseBody';
import type { Role } from '@/admin/interfaces/role.interface';
import type { UUID } from 'node:crypto';
import z from 'zod';

const getAllRolesParamSchema = z.object({
  serviceId: z.uuid('Must be a valid UUID').transform((str) => str as UUID),
});

type GetAllRolesReqParams = z.infer<typeof getAllRolesParamSchema>;
type GetAllRolesResBody = ResponseBody<{
  roles: Role[];
}>;

export {
  getAllRolesParamSchema,
  type GetAllRolesReqParams,
  type GetAllRolesResBody,
};
