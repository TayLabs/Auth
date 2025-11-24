import { type ResponseBody } from '@/types/ResponseBody';
import z from 'zod';

const refreshBodySchema = z.object({});

type RefreshReqBody = z.infer<typeof refreshBodySchema>;
type RefreshResBody = ResponseBody<{
	accessToken: string;
}>;

export {
	refreshBodySchema as default,
	type RefreshReqBody,
	type RefreshResBody,
};
