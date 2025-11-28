import express from 'express';
import { validate } from '@/middleware/validate.middleware';
import totpCreateBodySchema from '../dto/totpCreate.dto';
import totpVerifyBodySchema from '../dto/totpVerify.dto';
import totpValidateBodySchema from '../dto/totpValidate.dto';
import {
	totpCreateController,
	totpRemoveController,
	totpValidateController,
	totpVerifyController,
} from '../controllers/twoFactor.controllers';
import authenticate from '@/middleware/authenticate.middleware';
import totpRemoveBodySchema from '../dto/totpRemove.dto';

// /auth/*
const twoFactorRouter = express.Router();

twoFactorRouter.post(
	'/totp/create',
	authenticate(),
	validate(totpCreateBodySchema),
	totpCreateController
);
twoFactorRouter.post(
	'/totp/verify/:totpTokenId',
	authenticate(),
	validate(totpVerifyBodySchema),
	totpVerifyController
);
twoFactorRouter.post(
	'/totp/validate',
	authenticate('2fa'), // Allows token's marked as pending 2fa
	validate(totpValidateBodySchema),
	totpValidateController
);

twoFactorRouter.delete(
	'/totp/remove/:totpTokenId',
	authenticate(),
	validate(totpRemoveBodySchema),
	totpRemoveController
);

export { twoFactorRouter };
