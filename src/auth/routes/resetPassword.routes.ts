import express from 'express';
import { sendLink, reset } from '../controllers/resetPassword.controllers';
import {
  validateBody,
  validateQueryParams,
} from '@/middleware/validate.middleware';
import { resetBodySchema, resetQueryParamsSchema } from '../dto/reset.dto';
import { sendResetLinkBodySchema } from '../dto/sendResetLink.dto';

// /auth/password-reset/*
const resetPasswordRouter = express.Router();

resetPasswordRouter.post(
  '/send',
  validateBody(sendResetLinkBodySchema),
  sendLink
);
resetPasswordRouter.post(
  '/',
  validateQueryParams(resetQueryParamsSchema),
  validateBody(resetBodySchema),
  reset
);

export { resetPasswordRouter };
