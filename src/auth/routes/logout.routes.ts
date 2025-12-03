import { validateQueryParams } from '@/middleware/validate.middleware';
import { Router } from 'express';
import { logoutQueryParamsSchema } from '../dto/logout.dto';
import { logout, logoutAll } from '../controllers/logout.controllers';
import authenticate from '@/middleware/authenticate.middleware';

// /auth/logout/*
const logoutRouter = Router();

logoutRouter.delete('/all', authenticate(), logoutAll); // This is called before /:deviceId to avoid conflicts
logoutRouter.delete(
  '/{:deviceId}',
  authenticate(),
  validateQueryParams(logoutQueryParamsSchema),
  logout
);

export default logoutRouter;
