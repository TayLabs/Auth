import { type RequestHandler } from 'express';

export const notFoundHandler: RequestHandler = (req, res, next) => {
  return res.status(404).json({
    success: false,
    message: 'Resource Not Found',
  });
};
