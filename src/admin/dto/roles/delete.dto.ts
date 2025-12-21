import z from 'zod';
import type { ResponseBody } from '@/types/ResponseBody';
import type { UUID } from 'node:crypto';

const deleteRoleParamSchema = z.object({
	serviceId: z.uuid('Must be a valid UUID').transform((str) => str as UUID),
	roleId: z.uuid('Must be a valid UUID').transform((str) => str as UUID),
});

type DeleteRoleReqParams = z.infer<typeof deleteRoleParamSchema>;
type DeleteRoleResBody = ResponseBody<{
	role: {
		id: UUID;
	};
}>;

export {
	deleteRoleParamSchema,
	type DeleteRoleReqParams,
	type DeleteRoleResBody,
};
