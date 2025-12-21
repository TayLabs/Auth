import z from 'zod';
import type { ResponseBody } from '@/types/ResponseBody';
import type { UUID } from 'node:crypto';

const forcePasswordResetParamsSchema = z.object({
	userId: z.uuid('Must be a valid UUID').transform((str) => str as UUID),
});

type ForcePasswordResetReqParams = z.infer<
	typeof forcePasswordResetParamsSchema
>;
type ForcePasswordResetResBody = ResponseBody<undefined>;

export {
	forcePasswordResetParamsSchema,
	type ForcePasswordResetReqParams,
	type ForcePasswordResetResBody,
};
