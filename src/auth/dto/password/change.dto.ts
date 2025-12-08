import env from '@/types/env';
import { type ResponseBody } from '@/types/ResponseBody';
import z from 'zod';

const passwordValidation = z
	.string('Password must be a valid string')
	.min(8, 'Password must be at least 8 characters long')
	.max(31, 'Password must be at most 31 characters long');

if (env.CHECK_PASSWORD_COMPLEXITY) {
	passwordValidation
		.regex(
			/[!@#$%^&*(),.?":{}|<>]/,
			'Password must contain at least one special character'
		)
		.regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
		.regex(/[a-z]/, 'Password must contain at least one lowercase letter')
		.regex(/[0-9]/, 'Password must contain at least one number');
}

const changeBodySchema = z
	.object({
		currentPassword: z.string(),
		password: passwordValidation,
		passwordConfirm: z.string('Password confirmation must be a valid string'),
	})
	.refine(
		(data) => data.password === data.passwordConfirm,
		'Passwords do not match'
	);

type ChangeReqBody = z.infer<typeof changeBodySchema>;
type ChangeResBody = ResponseBody<{}>;

export { changeBodySchema, type ChangeReqBody, type ChangeResBody };
