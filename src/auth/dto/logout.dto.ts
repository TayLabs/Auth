import type { ResponseBody } from '@/types/ResponseBody';
import type { UUID } from 'node:crypto';
import { z } from 'zod';

const logoutQueryParamsSchema = z.object({
  deviceId: z
    .uuid('Invalid Device Id format')
    .transform((val) => val as UUID)
    .optional(),
});

type LogoutReqQueryParams = z.infer<typeof logoutQueryParamsSchema>;
type LogoutResBody = ResponseBody;

export {
  logoutQueryParamsSchema,
  type LogoutReqQueryParams,
  type LogoutResBody,
};
