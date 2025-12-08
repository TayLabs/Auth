import z from 'zod';
import type { ResponseBody } from '@/types/ResponseBody';
import type { UUID } from 'node:crypto';

const addRoleBodySchema = z.object({
	name: z
		.string('Must be a valid string')
		.min(1, 'Too short')
		.max(128, 'Too long'),
	assignToNewUser: z.boolean('Must be true or false'),
});

type AddRoleReqBody = z.infer<typeof addRoleBodySchema>;
type AddRoleResBody = ResponseBody<{
	role: {
		id: UUID;
		name: string;
	};
}>;

export { addRoleBodySchema, type AddRoleReqBody, type AddRoleResBody };
