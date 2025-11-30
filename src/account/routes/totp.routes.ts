import authenticate from '@/middleware/authenticate.middleware';
import { validateBody, validateParams } from '@/middleware/validate.middleware';
import { Router } from 'express';
import totpCreateBodySchema from '../dto/totpCreate.dto';
import totpValidateBodySchema from '../dto/totpValidate.dto';
import totpRemoveParamsSchema from '../dto/totpRemove.dto';
import {
	totpCreateController,
	totpRemoveController,
	totpValidateController,
} from '../controllers/totp.controllers';

const totpRouter = Router();

totpRouter.post(
	'/totp/create',
	authenticate(),
	validateBody(totpCreateBodySchema),
	totpCreateController
);
totpRouter.post(
	'/totp/validate',
	authenticate('2fa'), // Allows token's marked as pending 2fa
	validateBody(totpValidateBodySchema),
	totpValidateController
);

totpRouter.delete(
	'/totp/remove/:totpTokenId',
	authenticate(),
	validateParams(totpRemoveParamsSchema),
	totpRemoveController
);

export { totpRouter };
