import express from 'express';
import { validateBody } from '@/middleware/validate.middleware';
import { totpVerifyController } from '../controllers/twoFactor.controllers';
import authenticate from '@/middleware/authenticate.middleware';
import totpVerifyBodySchema from '../dto/totpVerify.dto';

// /auth/*
const twoFactorRouter = express.Router();

twoFactorRouter.post(
	'/totp/verify/:totpTokenId',
	authenticate(),
	validateBody(totpVerifyBodySchema),
	totpVerifyController
);

export { twoFactorRouter };
