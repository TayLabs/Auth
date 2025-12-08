import z from 'zod';
import type { ResponseBody } from '@/types/ResponseBody';
import type { UUID } from 'node:crypto';

const deleteServiceParamSchema = z.object({
  name: z
    .string('Must be a valid string')
    .min(1, 'Too short')
    .max(128, 'Too long'),
});

type DeleteServiceReqParams = z.infer<typeof deleteServiceParamSchema>;
type DeleteServiceResBody = ResponseBody<{
  service: {
    id: UUID;
    name: string;
  };
}>;

export {
  deleteServiceParamSchema,
  type DeleteServiceReqParams,
  type DeleteServiceResBody,
};
