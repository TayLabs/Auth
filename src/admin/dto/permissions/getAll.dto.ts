import type { ResponseBody } from '@/types/ResponseBody';
import type { Permission } from '@/admin/interfaces/permission.interface';
import z from 'zod';
import type { UUID } from 'node:crypto';

const getAllPermissionsParamSchema = z.object({
  serviceId: z.uuid('Must be a valid UUID').transform((str) => str as UUID),
});

type GetAllPermissionsReqParams = z.infer<typeof getAllPermissionsParamSchema>;
type GetAllPermissionsResBody = ResponseBody<{
  permissions: Permission[];
}>;

export {
  getAllPermissionsParamSchema,
  type GetAllPermissionsReqParams,
  type GetAllPermissionsResBody,
};
