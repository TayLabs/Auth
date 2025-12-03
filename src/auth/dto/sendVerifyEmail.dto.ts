import env from '@/types/env';
import { type ResponseBody } from '@/types/ResponseBody';
import z from 'zod';

const sendVerifyEmailBodySchema = z.object({
  linkBaseUrl: z
    .url('Must provide a valid url to link too')
    .refine((url) => url.startsWith(env.FRONTEND_URL), 'Invalid link base URL'),
});

type SendVerifyEmailReqBody = z.infer<typeof sendVerifyEmailBodySchema>;
type SendVerifyEmailResBody = ResponseBody<{}>;

export {
  sendVerifyEmailBodySchema,
  type SendVerifyEmailReqBody,
  type SendVerifyEmailResBody,
};
