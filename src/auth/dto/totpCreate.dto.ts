import { type ResponseBody } from '@/types/ResponseBody';
import type { UUID } from 'node:crypto';
import z from 'zod';

// const totpVerifyBodySchema = z.object({
// 	code: z
// 		.string()
// 		.regex(/^\d{1, 6}$/, 'Code must be a valid number that is 6 digits long')
// 		.transform(Number),
// });

const totpCreateBodySchema = z.undefined();

type TOTPCreateReqBody = z.infer<typeof totpCreateBodySchema>;
type TOTPCreateResBody = ResponseBody<{
	accessToken: string;
	qrCode: string;
	totpTokenRecord: {
		id: UUID;
		isVerified: boolean;
		lastUsedAt: Date | null;
		createdAt: Date;
	};
}>;

export {
	totpCreateBodySchema as default,
	type TOTPCreateReqBody,
	type TOTPCreateResBody,
};
