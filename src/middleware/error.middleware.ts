import { logger } from '@/config/logger/winston';
import AppError from '@/types/AppError';
import env from '@/types/env';
import { ResponseBody } from '@/types/ResponseBody';
import { type ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler<{}, ResponseBody> = (
	err,
	_req,
	res,
	_next
) => {
	logger.error(err);

	if (env.NODE_ENV === 'development') {
		console.error(
			err instanceof Error
				? {
						statusCode: err instanceof AppError ? err.statusCode : 500,
						message: err.message,
						stack: err.stack,
				  }
				: err
		);
	}

	return res.status(err instanceof AppError ? err.statusCode : 500).json({
		success: false,
		message: err instanceof Error ? err.message : JSON.stringify(err),
		stack:
			env.NODE_ENV === 'development' && err instanceof Error
				? err.stack
				: undefined,
	});
};
