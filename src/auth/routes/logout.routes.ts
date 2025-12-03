import { validateQueryParams } from '@/middleware/validate.middleware';
import { Router } from 'express';
import { logoutQueryParamsSchema } from '../dto/logout.dto';
import { logout, logoutAll } from '../controllers/logout.controllers';
import authenticate from '@/middleware/authenticate.middleware';

// /auth/logout/*
const logoutRouter = Router();

logoutRouter.delete(
  /\/(?<deviceId>[0-9a-f]{8}\-[0-9a-f]{4}\-[0-9a-f]{4}\-[0-9a-f]{4}\-[0-9a-f]{12})$/, // optional query parameter for deviceId as UUIDv4
  authenticate(),
  validateQueryParams(logoutQueryParamsSchema),
  logout
);
logoutRouter.delete('/all', authenticate(), logoutAll);

export default logoutRouter;
