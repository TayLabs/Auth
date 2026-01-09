import z from 'zod';
import type { ResponseBody } from '@/types/ResponseBody';
import type { Role } from '@/admin/interfaces/role.interface';
import type { UUID } from 'node:crypto';
import { User } from '@/interfaces/user.interface';

const getRolesParamsSchema = z.object({
  userId: z.uuid('Must be a valid UUID').transform((str) => str as UUID),
});

type GetRolesReqParams = z.infer<typeof getRolesParamsSchema>;
type GetRolesResBody = ResponseBody<{
  user: User & { roles: Omit<Role, 'permissions'>[] };
}>;

export { getRolesParamsSchema, type GetRolesReqParams, type GetRolesResBody };
