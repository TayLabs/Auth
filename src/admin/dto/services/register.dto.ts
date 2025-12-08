import z from 'zod';
import type { ResponseBody } from '@/types/ResponseBody';
import type { Service } from '@/admin/interfaces/service.interface';

const registerServiceBodySchema = z.object({
  name: z
    .string('Must be a valid string')
    .min(1, 'Too short')
    .max(128, 'Too long'),
});

type RegisterServiceReqBody = z.infer<typeof registerServiceBodySchema>;
type RegisterServiceResBody = ResponseBody<{
  service: Service;
}>;

export {
  registerServiceBodySchema,
  type RegisterServiceReqBody,
  type RegisterServiceResBody,
};
