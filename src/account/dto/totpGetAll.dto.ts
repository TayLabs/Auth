import { type ResponseBody } from '@/types/ResponseBody';
import { TOTPToken } from '../interfaces/totpToken.interface';

type TOTPGetAllResBody = ResponseBody<{
  totpTokens: TOTPToken[];
}>;

export { type TOTPGetAllResBody };
