import { type ResponseBody } from '@/types/ResponseBody';
import type { UUID } from 'node:crypto';
import z from 'zod';

const totpRemoveBodySchema = z.undefined();

type TOTPRemoveReqBody = z.infer<typeof totpRemoveBodySchema>;
type TOTPRemoveResBody = ResponseBody<{
	id: UUID;
}>;

export {
	totpRemoveBodySchema as default,
	type TOTPRemoveReqBody,
	type TOTPRemoveResBody,
};
