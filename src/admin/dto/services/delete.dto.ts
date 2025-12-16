import z from 'zod';
import type { ResponseBody } from '@/types/ResponseBody';
import type { UUID } from 'node:crypto';

const deleteServiceParamSchema = z.object({
  serviceId: z.uuid('Must be a valid UUID').transform((str) => str as UUID),
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
