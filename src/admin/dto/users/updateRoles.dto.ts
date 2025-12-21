import z from 'zod';
import type { ResponseBody } from '@/types/ResponseBody';
import type { Role } from '@/admin/interfaces/Role.interface';
import type { UUID } from 'node:crypto';

const updateRolesParamsSchema = z.object({
	userId: z.uuid('Must be a valid UUID').transform((str) => str as UUID),
});

const updateRolesBodySchema = z.object({
	roles: z.array(
		z.uuid('Invalid UUID').transform((str) => str as UUID),
		'Must be a valid array of UUIDs'
	),
});

type UpdateRolesReqParams = z.infer<typeof updateRolesParamsSchema>;
type UpdateRolesReqBody = z.infer<typeof updateRolesBodySchema>;
type UpdateRolesResBody = ResponseBody<{
	roles: Role[];
}>;

export {
	updateRolesParamsSchema,
	updateRolesBodySchema,
	type UpdateRolesReqParams,
	type UpdateRolesReqBody,
	type UpdateRolesResBody,
};
