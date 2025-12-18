import express from 'express';
import { validateBody } from '@/middleware/validate.middleware';
import loginBodySchema from '../dto/login.dto';
import signupBodySchema from '../dto/signup.dto';
import refreshBodySchema from '../dto/refresh.dto';
import {
  loginController,
  refreshController,
  signupController,
} from '../controllers/login.controllers';
import {
  loginRateLimit,
  refreshRateLimit,
  signUpRateLimit,
} from '@/middleware/rateLimiters/login.limiter';

// /auth/*
const loginRouter = express.Router({ mergeParams: true });

loginRouter.post(
  '/login',
  loginRateLimit,
  validateBody(loginBodySchema),
  loginController
);
loginRouter.post(
  '/signup',
  signUpRateLimit,
  validateBody(signupBodySchema),
  signupController
);
loginRouter.post(
  '/refresh',
  refreshRateLimit,
  validateBody(refreshBodySchema),
  refreshController
);

export { loginRouter };
