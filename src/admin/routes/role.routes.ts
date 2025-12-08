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
import { addRoleBodySchema, addRoleParamSchema } from '../dto/roles/add.dto';
import { getRoleParamSchema } from '../dto/roles/get.dto';
import { deleteRoleParamSchema } from '../dto/roles/delete.dto';
import {
  updateRoleBodySchema,
  updateRoleParamSchema,
} from '../dto/roles/update.dto';
import { getAllRolesParamSchema } from '../dto/roles/getAll.dto';

const roleRouter = Router({ mergeParams: true });

roleRouter.get(
  '/',
  authenticate({ allow: ['role.read'] }),
  validateParams(getAllRolesParamSchema),
  getAll
);
roleRouter.get(
  '/:roleId',
  authenticate({ allow: ['role.read'] }),
  validateParams(getRoleParamSchema),
  get
);
roleRouter.post(
  '/',
  authenticate({ allow: ['role.write'] }),
  validateParams(addRoleParamSchema),
  validateBody(addRoleBodySchema),
  add
);
roleRouter.patch(
  '/:roleId',
  authenticate({ allow: ['role.write'] }),
  validateParams(updateRoleParamSchema),
  validateBody(updateRoleBodySchema),
  update
);
roleRouter.delete(
  '/:roleId',
  authenticate({ allow: ['role.write'] }),
  validateParams(deleteRoleParamSchema),
  validateParams(deleteRoleParamSchema),
  deleteRole
);

export { roleRouter };
