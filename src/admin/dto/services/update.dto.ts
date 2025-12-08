import z from 'zod';
import type { ResponseBody } from '@/types/ResponseBody';
import type { Service } from '@/admin/interfaces/service.interface';

const updateServiceBodySchema = z.object({
  name: z
    .string('Must be a valid string')
    .min(1, 'Too short')
    .max(128, 'Too long'),
});

type UpdateServiceReqBody = z.infer<typeof updateServiceBodySchema>;
type UpdateServiceResBody = ResponseBody<{
  service: Service;
}>;

export {
  updateServiceBodySchema,
  type UpdateServiceReqBody,
  type UpdateServiceResBody,
};
