import { PendingActionType } from '@/auth/services/Token.service';
import { type ResponseBody } from '@/types/ResponseBody';
import z from 'zod';

const totpValidateBodySchema = z.object({
  code: z
    .string()
    .regex(/^\d{6}$/, 'Code must be a valid number that is 6 digits long')
    .transform(Number),
});

type TOTPValidateReqBody = z.infer<typeof totpValidateBodySchema>;
type TOTPValidateResBody = ResponseBody<{
  pending: PendingActionType;
  accessToken: string;
}>;

export {
  totpValidateBodySchema as default,
  type TOTPValidateReqBody,
  type TOTPValidateResBody,
};
