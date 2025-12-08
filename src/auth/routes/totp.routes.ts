import express from 'express';
import { validateBody } from '@/middleware/validate.middleware';
import { validate } from '../controllers/totp.controllers';
import authenticate from '@/middleware/authenticate.middleware';
import totpValidateBodySchema from '@/auth/dto/totp/validate.dto';

// /auth/*
const totpRouter = express.Router();

totpRouter.post(
  '/validate',
  authenticate({ acceptPending: '2fa' }), // Allows token's marked as pending 2fa
  validateBody(totpValidateBodySchema),
  validate
);

export { totpRouter };
