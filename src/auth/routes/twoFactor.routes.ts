import express from 'express';
import { validateBody } from '@/middleware/validate.middleware';
import { totpValidateController } from '../controllers/twoFactor.controllers';
import authenticate from '@/middleware/authenticate.middleware';
import totpValidateBodySchema from '@/auth/dto/totpValidate.dto';
import { totpRouter } from '@/account/routes/totp.routes';

// /auth/*
const twoFactorRouter = express.Router();

totpRouter.post(
  '/validate',
  authenticate({ acceptPending: '2fa' }), // Allows token's marked as pending 2fa
  validateBody(totpValidateBodySchema),
  totpValidateController
);

export { twoFactorRouter };
