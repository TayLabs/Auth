import authenticate from '@/middleware/authenticate.middleware';
import { Router } from 'express';
import { add } from '../controllers/permission.controllers';
import { validateBody } from '@/middleware/validate.middleware';
import { addPermissionBodySchema } from '../dto/permissions/add.dto';

const permissionRouter = Router();

permissionRouter.post(
  '/',
  authenticate({ allow: ['permission.write'] }),
  validateBody(addPermissionBodySchema),
  add
);

export { permissionRouter };
