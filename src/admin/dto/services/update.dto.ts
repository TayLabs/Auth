import z from 'zod';
import type { ResponseBody } from '@/types/ResponseBody';
import type { Service } from '@/admin/interfaces/service.interface';
import type { UUID } from 'node:crypto';

const updateServiceParamSchema = z.object({
  serviceId: z.uuid('Must be a valid UUID').transform((str) => str as UUID),
});

const updateServiceBodySchema = z.object({
  name: z
    .string('Must be a valid string')
    .min(1, 'Too short')
    .max(128, 'Too long'),
});

type UpdateServiceReqParams = z.infer<typeof updateServiceParamSchema>;
type UpdateServiceReqBody = z.infer<typeof updateServiceBodySchema>;
type UpdateServiceResBody = ResponseBody<{
  service: Service;
}>;

export {
  updateServiceParamSchema,
  updateServiceBodySchema,
  type UpdateServiceReqParams,
  type UpdateServiceReqBody,
  type UpdateServiceResBody,
};
