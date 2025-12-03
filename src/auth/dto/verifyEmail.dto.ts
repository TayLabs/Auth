import { type ResponseBody } from '@/types/ResponseBody';
import z from 'zod';

const verifyEmailQueryParamsSchema = z.object({
	t: z.string('Must include url parameter for verifyEmail token'),
});

type VerifyEmailReqQueryParams = z.infer<typeof verifyEmailQueryParamsSchema>;
type VerifyEmailResBody = ResponseBody<{}>;

export {
	verifyEmailQueryParamsSchema,
	type VerifyEmailReqQueryParams,
	type VerifyEmailResBody,
};
