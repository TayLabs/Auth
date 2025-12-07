import env from '@/types/env';
import { type ResponseBody } from '@/types/ResponseBody';
import { type UUID } from 'node:crypto';
import z from 'zod';

const loginBodySchema = z.object({
	email: z.union([
		z.email('Invalid email address'),
		z.literal(env.ADMIN.EMAIL),
	]),
	password: z.string('Password must be a valid string'),
});

type LoginReqBody = z.infer<typeof loginBodySchema>;
type LoginResBody = ResponseBody<{
	user: {
		id: UUID;
		email: string;
		firstName: string;
		lastName: string;
		userName: string;
	};
	accessToken: string;
}>;

export { loginBodySchema as default, type LoginReqBody, type LoginResBody };
