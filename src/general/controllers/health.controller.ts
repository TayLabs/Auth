import { db } from '@/config/db';
import { controller } from '@/middleware/controller.middleware';
import HttpStatus from '@/types/HttpStatus.enum';
import { type ResponseBody } from '@/types/ResponseBody';

export const check = controller<
	undefined,
	ResponseBody<undefined> & { status: 'connected' }
>(async (_req, res, _next) => {
	await db.select(); // Test Database connectivity (Should be up otherwise api throw errors)

	res.status(HttpStatus.OK).json({
		success: true,
		data: undefined,
		status: 'connected',
	});
});
