import z from 'zod';
import type { ResponseBody } from '@/types/ResponseBody';
import type { Role } from '@/admin/interfaces/Role.interface';
import type { UUID } from 'node:crypto';

const updateRoleParamSchema = z.object({
	serviceId: z.uuid('Must be a valid UUID').transform((str) => str as UUID),
	roleId: z.uuid('Must be a valid UUID').transform((str) => str as UUID),
});

const updateRoleBodySchema = z.object({
	name: z
		.string('Must be a valid string')
		.min(1, 'Too short')
		.max(128, 'Too long'),
	assignToNewUser: z.boolean('Invalid boolean value').optional(),
	permissions: z.array(
		z.uuid('Invalid UUID').transform((str) => str as UUID),
		'Invalid array of UUIDs'
	),
});

type UpdateRoleReqParams = z.infer<typeof updateRoleParamSchema>;
type UpdateRoleReqBody = z.infer<typeof updateRoleBodySchema>;
type UpdateRoleResBody = ResponseBody<{
	role: Role;
}>;

export {
	updateRoleParamSchema,
	updateRoleBodySchema,
	type UpdateRoleReqParams,
	type UpdateRoleReqBody,
	type UpdateRoleResBody,
};
