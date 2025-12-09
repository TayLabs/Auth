import { Router } from 'express';
import authenticate from '@/middleware/authenticate.middleware';
import { validateParams } from '@/middleware/validate.middleware';
import { update } from '../controllers/profile.controllers';
import updateBodySchema from '../dto/profile/update.dto';

// /account/profile/*
const profileRouter = Router({ mergeParams: true });

profileRouter.patch(
  '/',
  authenticate({ allow: ['user.write'] }),
  validateParams(updateBodySchema),
  update
);

export { profileRouter };
