import { type ResponseBody } from '@/types/ResponseBody';
import z from 'zod';

const resetQueryParamsSchema = z.object({
  t: z.string('Must include url parameter for reset token'),
});

const resetBodySchema = z.object({
  password: z.string(),
  passwordConfirm: z.string(),
});

type ResetReqQueryParams = z.infer<typeof resetQueryParamsSchema>;
type ResetReqBody = z.infer<typeof resetBodySchema>;
type ResetResBody = ResponseBody<{}>;

export {
  resetBodySchema,
  resetQueryParamsSchema,
  type ResetReqQueryParams,
  type ResetReqBody,
  type ResetResBody,
};
