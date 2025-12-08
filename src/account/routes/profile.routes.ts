import { Router } from 'express';
import authenticate from '@/middleware/authenticate.middleware';
import { validateParams } from '@/middleware/validate.middleware';
import toggleTwoFactorParamsSchema from '../dto/toggleTwoFactor.dto';
import { update } from '../controllers/profile.controllers';

// /account/profile/*
const profileRouter = Router();

profileRouter.patch(
	'/security',
	authenticate({ allow: ['user.write'] }),
	validateParams(toggleTwoFactorParamsSchema),
	update
);

export { profileRouter };
