import { Router } from 'express';
import authenticate from '@/middleware/authenticate.middleware';
import { validateBody } from '@/middleware/validate.middleware';
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
  validateBody(updateBodySchema),
  update
);

export { profileRouter };
