import { Router } from 'express';
import authenticate from '@/middleware/authenticate.middleware';
import { validateParams } from '@/middleware/validate.middleware';
import toggleTwoFactorParamsSchema from '../dto/toggleTwoFactor.dto';
import { update } from '../controllers/profile.controllers';

const profileRouter = Router();

profileRouter.patch(
  '/profile',
  authenticate(),
  validateParams(toggleTwoFactorParamsSchema),
  update
);

export { profileRouter };
