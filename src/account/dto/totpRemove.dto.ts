import { type ResponseBody } from '@/types/ResponseBody';
import type { UUID } from 'node:crypto';
import z from 'zod';

const totpRemoveParamsSchema = z.object({
	totpTokenId: z
		.uuidv4('Must include valid UUID in url parameter for totp token id')
		.transform((str) => str as UUID), // type the property as a UUID. .brand() returns 'string & $brand<UUID>'
});

type TOTPRemoveReqParams = z.infer<typeof totpRemoveParamsSchema>;
type TOTPRemoveReqBody = undefined;
type TOTPRemoveResBody = ResponseBody<{
	id: UUID;
}>;

export {
	totpRemoveParamsSchema as default,
	type TOTPRemoveReqParams,
	type TOTPRemoveReqBody,
	type TOTPRemoveResBody,
};
