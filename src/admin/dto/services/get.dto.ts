import z from 'zod';
import type { ResponseBody } from '@/types/ResponseBody';
import type { Service } from '@/admin/interfaces/service.interface';
import type { UUID } from 'node:crypto';

const getServiceParamSchema = z.object({
  serviceId: z.uuid('Must be a valid UUID').transform((str) => str as UUID),
});

type GetServiceReqParams = z.infer<typeof getServiceParamSchema>;
type GetServiceResBody = ResponseBody<{
  service: Service;
}>;

export {
  getServiceParamSchema,
  type GetServiceReqParams,
  type GetServiceResBody,
};
