import { type ResponseBody } from '@/types/ResponseBody';
import { type UUID } from 'node:crypto';
import z from 'zod';

const loginBodySchema = z.object({
	email: z.email('Invalid email address'),
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
