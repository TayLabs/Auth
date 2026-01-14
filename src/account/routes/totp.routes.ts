import authenticate from '@/middleware/authenticate.middleware';
import { validateBody, validateParams } from '@/middleware/validate.middleware';
import { Router } from 'express';
import totpCreateBodySchema from '../dto/totpCreate.dto';
import totpRemoveParamsSchema from '../dto/totpRemove.dto';
import {
  totpCreateController,
  totpGetAllController,
  totpRemoveController,
  totpVerifyController,
} from '../controllers/totp.controllers';
import totpVerifyBodySchema from '@/account/dto/totpVerify.dto';

const totpRouter = Router({ mergeParams: true });

totpRouter.get(
  '/',
  authenticate({ allow: ['user.read'] }),
  totpGetAllController
);

totpRouter.post(
  '/create',
  authenticate({ allow: ['user.write'] }),
  validateBody(totpCreateBodySchema),
  totpCreateController
);

totpRouter.post(
  '/verify/:totpTokenId',
  authenticate({ allow: ['user.write'] }),
  validateBody(totpVerifyBodySchema),
  totpVerifyController
);

totpRouter.delete(
  '/remove/:totpTokenId',
  authenticate({ allow: ['user.write'] }),
  validateParams(totpRemoveParamsSchema),
  totpRemoveController
);

export { totpRouter };
