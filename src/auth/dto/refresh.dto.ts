import { type ResponseBody } from '@/types/ResponseBody';
import z from 'zod';
import type { PendingActionType } from '../services/Token.service';

const refreshBodySchema = z.undefined();

type RefreshReqBody = z.infer<typeof refreshBodySchema>;
type RefreshResBody = ResponseBody<{
  pending: PendingActionType;
  accessToken: string;
}>;

export {
  refreshBodySchema as default,
  type RefreshReqBody,
  type RefreshResBody,
};
