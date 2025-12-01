import { Router } from 'express';
import authenticate from '@/middleware/authenticate.middleware';
import { validateParams } from '@/middleware/validate.middleware';
import toggleTwoFactorParamsSchema from '../dto/toggleTwoFactor.dto';
import { toggleTwoFactor } from '../controllers/security.controllers';

const securityRouter = Router();

securityRouter.post(
	'/security/two-factor/:switch',
	authenticate(),
	validateParams(toggleTwoFactorParamsSchema),
	toggleTwoFactor
);

export { securityRouter };
