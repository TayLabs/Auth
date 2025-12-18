import z from 'zod';
import type { ResponseBody } from '@/types/ResponseBody';
import type { Permission } from '@/admin/interfaces/permission.interface';
import type { UUID } from 'node:crypto';

const addPermissionParamSchema = z.object({
	serviceId: z.uuid('Must be a valid UUID').transform((str) => str as UUID),
});

const addPermissionBodySchema = z.object({
	key: z
		.string('Must be a valid string')
		.min(1, 'Too short')
		.max(128, 'Too long'),
	description: z.string('Must be a valid string').optional(),
});

type AddPermissionReqParams = z.infer<typeof addPermissionParamSchema>;
type AddPermissionReqBody = z.infer<typeof addPermissionBodySchema>;
type AddPermissionResBody = ResponseBody<{
	permission: Permission;
}>;

export {
	addPermissionParamSchema,
	addPermissionBodySchema,
	type AddPermissionReqParams,
	type AddPermissionReqBody,
	type AddPermissionResBody,
};
