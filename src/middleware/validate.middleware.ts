import { ResponseBody } from '@/types/ResponseBody';
import { type RequestHandler } from 'express';
import z from 'zod';

export function validate<T extends z.ZodType>(
	schema: T
): RequestHandler<{}, ResponseBody> {
	return async (req, res, next) => {
		try {
			const validatedData = await schema.parseAsync(req.body);
			req.body = validatedData;
			next();
		} catch (err) {
			if (err instanceof z.ZodError) {
				const errorTree = z.treeifyError<T>(err as z.ZodError<T>).properties;
				return res.status(400).json({
					success: false,
					message: errorTree
						? 'Invalid request body: ' +
						  Object.entries(errorTree)
								.map(([key, value]) => `${key}: ${value.errors.join(', ')}`)
								.join(' | ')
						: 'Invalid request body',
				});
			} else {
				next(err);
			}
		}
	};
}
