import express from 'express';
import {
  sendLink,
  reset,
  change,
} from '../controllers/resetPassword.controllers';
import {
  validateBody,
  validateQueryParams,
} from '@/middleware/validate.middleware';
import {
  resetBodySchema,
  resetQueryParamsSchema,
} from '../dto/password/reset.dto';
import { sendResetLinkBodySchema } from '../dto/password/sendResetLink.dto';
import { changeBodySchema } from '../dto/password/change.dto';
import authenticate from '@/middleware/authenticate.middleware';

// /auth/password/*
const resetPasswordRouter = express.Router({ mergeParams: true });

resetPasswordRouter.post(
  '/reset/request',
  validateBody(sendResetLinkBodySchema),
  sendLink
);
resetPasswordRouter.patch(
  '/reset',
  validateQueryParams(resetQueryParamsSchema),
  validateBody(resetBodySchema),
  reset
);
resetPasswordRouter.patch(
  '/change',
  authenticate({ allow: ['user.write'], acceptPending: ['passwordReset'] }),
  validateBody(changeBodySchema),
  change
);

export { resetPasswordRouter };
