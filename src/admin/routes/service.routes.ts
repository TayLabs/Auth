import { validateBody, validateParams } from '@/middleware/validate.middleware';
import { Router } from 'express';
import { registerServiceBodySchema } from '../dto/services/register.dto';
import {
  deleteService,
  get,
  getAll,
  register,
  update,
} from '../controllers/service.controllers';
import authenticate from '@/middleware/authenticate.middleware';
import { getServiceParamSchema } from '../dto/services/get.dto';
import { updateServiceBodySchema } from '../dto/services/update.dto';
import { deleteServiceParamSchema } from '../dto/services/delete.dto';

const serviceRouter = Router();

serviceRouter.get('/', authenticate({ allow: ['service.read'] }), getAll);
serviceRouter.get(
  '/:serviceId',
  authenticate({ allow: ['service.read'] }),
  validateParams(getServiceParamSchema),
  get
);
serviceRouter.post(
  '/',
  authenticate({ allow: ['service.write'] }),
  validateBody(registerServiceBodySchema),
  register
);
serviceRouter.patch(
  '/:serviceId',
  authenticate({ allow: ['service.write'] }),
  validateBody(updateServiceBodySchema),
  update
);
serviceRouter.delete(
  '/:serviceId',
  authenticate({ allow: ['service.write'] }),
  validateParams(deleteServiceParamSchema),
  deleteService
);

export { serviceRouter };
