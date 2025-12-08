import z from 'zod';
import type { ResponseBody } from '@/types/ResponseBody';
import type { UUID } from 'node:crypto';

const addRoleParamSchema = z.object({
  serviceId: z.uuid('Must be a valid UUID').transform((str) => str as UUID),
});

const addRoleBodySchema = z.object({
  name: z
    .string('Must be a valid string')
    .min(1, 'Too short')
    .max(128, 'Too long'),
  assignToNewUser: z.boolean('Must be true or false').optional(),
});

type AddRoleReqParams = z.infer<typeof addRoleParamSchema>;
type AddRoleReqBody = z.infer<typeof addRoleBodySchema>;
type AddRoleResBody = ResponseBody<{
  role: {
    id: UUID;
    name: string;
  };
}>;

export {
  addRoleParamSchema,
  addRoleBodySchema,
  type AddRoleReqParams,
  type AddRoleReqBody,
  type AddRoleResBody,
};
