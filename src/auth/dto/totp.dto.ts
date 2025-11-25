import { type ResponseBody } from '@/types/ResponseBody';
import z from 'zod';

const totpBodySchema = z.object({
	code: z
		.string()
		.regex(/^\d{1, 6}$/, 'Code must be a valid number that is 6 digits long')
		.transform(Number),
});

type TOTPReqBody = z.infer<typeof totpBodySchema>;
type TOTPResBody = ResponseBody<{
	accessToken: string;
}>;

export { totpBodySchema as default, type TOTPReqBody, type TOTPResBody };
