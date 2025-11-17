import { logger } from '@/config/logger/winston';
import env from '@/types/env';
import { type ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  logger.error(err);

  if (env.NODE_ENV === 'development') {
    console.error(
      err instanceof Error
        ? {
            message: err.message,
            stack: err.stack,
          }
        : err
    );

    return res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : JSON.stringify(err),
      stack: err instanceof Error ? err.stack : undefined,
    });
  } else {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};
