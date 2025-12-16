import { ResponseBody } from '@/types/ResponseBody';

type GetCSRFResBody = ResponseBody<{
  csrfToken: string;
}>;

export { type GetCSRFResBody };
