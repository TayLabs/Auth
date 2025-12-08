import z from 'zod';
import type { ResponseBody } from '@/types/ResponseBody';
import type { Service } from '@/admin/interfaces/service.interface';

const getServiceParamSchema = z.object({
  name: z
    .string('Must be a valid string')
    .min(1, 'Too short')
    .max(128, 'Too long'),
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
