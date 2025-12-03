import {
  validateBody,
  validateQueryParams,
} from '@/middleware/validate.middleware';
import { Router } from 'express';
import { logoutQueryParamsSchema } from '../dto/logout.dto';
import { logout, logoutAll } from '../controllers/logout.controllers';
import authenticate from '@/middleware/authenticate.middleware';

// /auth/logout/*
const logoutRouter = Router();

logoutRouter.delete(
  '/:deviceId',
  authenticate(),
  validateQueryParams(logoutQueryParamsSchema),
  logout
);
logoutRouter.delete('/all', authenticate(), logoutAll);

export default logoutRouter;
