import authenticate from '@/middleware/authenticate.middleware';
import { Router } from 'express';
import {
  add,
  deleteRole,
  get,
  getAll,
  update,
} from '../controllers/role.controllers';
import { validateBody, validateParams } from '@/middleware/validate.middleware';
import { addRoleBodySchema } from '../dto/roles/add.dto';
import { getRoleParamSchema } from '../dto/roles/get.dto';
import { deleteRoleParamSchema } from '../dto/roles/delete.dto';
import { updateRoleBodySchema } from '../dto/roles/update.dto';

const roleRouter = Router();

roleRouter.get('/', authenticate({ allow: ['role.read'] }), getAll);
roleRouter.get(
  '/:roleId',
  authenticate({ allow: ['role.read'] }),
  validateParams(getRoleParamSchema),
  get
);
roleRouter.post(
  '/',
  authenticate({ allow: ['role.write'] }),
  validateBody(addRoleBodySchema),
  add
);
roleRouter.patch(
  '/',
  authenticate({ allow: ['role.write'] }),
  validateBody(updateRoleBodySchema),
  update
);
roleRouter.delete(
  '/:roleId',
  authenticate({ allow: ['role.write'] }),
  validateParams(deleteRoleParamSchema),
  deleteRole
);

export { roleRouter };
