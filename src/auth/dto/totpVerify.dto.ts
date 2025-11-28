import { type ResponseBody } from '@/types/ResponseBody';
import z from 'zod';

const totpVerifyBodySchema = z.object({
	code: z
		.string()
		.regex(/^\d{6}$/, 'Code must be a valid number that is 6 digits long')
		.transform(Number),
});

type TOTPVerifyReqBody = z.infer<typeof totpVerifyBodySchema>;
type TOTPVerifyResBody = ResponseBody<{
	// TODO: Should it send any data back?
}>;

export {
	totpVerifyBodySchema as default,
	type TOTPVerifyReqBody,
	type TOTPVerifyResBody,
};
