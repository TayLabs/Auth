import env from '@/types/env';
import { type RequestHandler } from 'express';
import z from 'zod';

export function validate<T extends z.ZodObject>(schema: T): RequestHandler {
  return async (req, res, next) => {
    try {
      const validatedData = await schema.parseAsync(req.body);
      req.body = validatedData;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errorTree = z.treeifyError<T>(err as z.ZodError<T>).properties;

        return res.status(400).json({
          message: 'Invalid request body',
          stack:
            env.NODE_ENV === 'development'
              ? errorTree &&
                Object.entries(errorTree).map(
                  ([key, value]) => `${key}: ${value.errors.join(', ')}`
                )
              : undefined,
        });
      } else {
        next(err);
      }
    }
  };
}
