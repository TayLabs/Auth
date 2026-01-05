import { Router } from 'express';
import authenticate from '@/middleware/authenticate.middleware';
import { validateParams } from '@/middleware/validate.middleware';
import { get, update } from '../controllers/profile.controllers';
import updateBodySchema from '../dto/profile/update.dto';

// /account/profile/*
const profileRouter = Router({ mergeParams: true });

profileRouter.get(
  '/',
  authenticate({
    allow: ['user.read'],
    acceptPending: ['passwordReset', '2fa', 'emailVerification'],
  }),
  get
);
profileRouter.patch(
  '/',
  authenticate({ allow: ['user.write'] }),
  validateParams(updateBodySchema),
  update
);

export { profileRouter };
