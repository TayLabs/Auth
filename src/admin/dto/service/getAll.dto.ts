import type { ResponseBody } from '@/types/ResponseBody';
import type { Service } from '@/admin/interfaces/Service.interface';

type GetAllResBody = ResponseBody<{
	services: Service[];
}>;

export { type GetAllResBody };
