import { type ResponseBody } from '@/types/ResponseBody';
import z from 'zod';

const sendResetLinkBodySchema = z.object({
  email: z.email('Must provide a valid email address'),
  linkBaseUrl: z.url('Must provide a valid url to link too'),
});

type SendResetLinkReqBody = z.infer<typeof sendResetLinkBodySchema>;
type SendResetLinkResBody = ResponseBody<{}>;

export {
  sendResetLinkBodySchema,
  type SendResetLinkReqBody,
  type SendResetLinkResBody,
};
