import { type ResponseBody } from '@/types/ResponseBody';
import type { UUID } from 'node:crypto';
import z from 'zod';

const totpCreateBodySchema = z.undefined();

type TOTPCreateReqBody = z.infer<typeof totpCreateBodySchema>;
type TOTPCreateResBody = ResponseBody<{
	totpTokenRecord: {
		id: UUID;
		isVerified: boolean;
		lastUsedAt: Date | null;
		createdAt: Date;
	};
	qrCode: string;
}>;

export {
	totpCreateBodySchema as default,
	type TOTPCreateReqBody,
	type TOTPCreateResBody,
};
