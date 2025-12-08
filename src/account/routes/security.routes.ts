import { Router } from 'express';
import authenticate from '@/middleware/authenticate.middleware';
import { validateParams } from '@/middleware/validate.middleware';
import toggleTwoFactorParamsSchema from '../dto/toggleTwoFactor.dto';
import { toggleTwoFactor } from '../controllers/security.controllers';

// /account/security/*
const securityRouter = Router();

securityRouter.patch(
  '/two-factor/:switch',
  authenticate(),
  validateParams(toggleTwoFactorParamsSchema),
  toggleTwoFactor
);

export { securityRouter };
