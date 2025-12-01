import authenticate from '@/middleware/authenticate.middleware';
import { validateBody, validateParams } from '@/middleware/validate.middleware';
import { Router } from 'express';
import totpCreateBodySchema from '../dto/totpCreate.dto';
import totpRemoveParamsSchema from '../dto/totpRemove.dto';
import {
  totpCreateController,
  totpRemoveController,
  totpVerifyController,
} from '../controllers/totp.controllers';
import totpVerifyBodySchema from '@/account/dto/totpVerify.dto';

const totpRouter = Router();

totpRouter.post(
  '/totp/create',
  authenticate(),
  validateBody(totpCreateBodySchema),
  totpCreateController
);

totpRouter.post(
  '/verify/:totpTokenId',
  authenticate(),
  validateBody(totpVerifyBodySchema),
  totpVerifyController
);

totpRouter.delete(
  '/totp/remove/:totpTokenId',
  authenticate(),
  validateParams(totpRemoveParamsSchema),
  totpRemoveController
);

export { totpRouter };
