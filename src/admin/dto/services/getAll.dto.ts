import type { ResponseBody } from '@/types/ResponseBody';
import type { Service } from '@/admin/interfaces/service.interface';

type GetAllServicesResBody = ResponseBody<{
  services: Service[];
}>;

export { type GetAllServicesResBody };
