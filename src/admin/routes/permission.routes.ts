import authenticate from '@/middleware/authenticate.middleware';
import { Router } from 'express';
import {
  add,
  deletePermission,
  get,
  getAll,
  update,
} from '../controllers/permission.controllers';
import { validateBody, validateParams } from '@/middleware/validate.middleware';
import {
  addPermissionBodySchema,
  addPermissionParamSchema,
} from '../dto/permissions/add.dto';
import { getPermissionParamSchema } from '../dto/permissions/get.dto';
import { deletePermissionParamSchema } from '../dto/permissions/delete.dto';
import {
  updatePermissionBodySchema,
  updatePermissionParamSchema,
} from '../dto/permissions/update.dto';
import { getAllPermissionsParamSchema } from '../dto/permissions/getAll.dto';

const permissionRouter = Router();

permissionRouter.get(
  '/',
  authenticate({ allow: ['permission.read'] }),
  validateParams(getAllPermissionsParamSchema),
  getAll
);
permissionRouter.get(
  '/:permissionId',
  authenticate({ allow: ['permission.read'] }),
  validateParams(getPermissionParamSchema),
  get
);
permissionRouter.post(
  '/',
  authenticate({ allow: ['permission.write'] }),
  validateParams(addPermissionParamSchema),
  validateBody(addPermissionBodySchema),
  add
);
permissionRouter.patch(
  '/:permissionId',
  authenticate({ allow: ['permission.write'] }),
  validateParams(updatePermissionParamSchema),
  validateBody(updatePermissionBodySchema),
  update
);
permissionRouter.delete(
  '/:permissionId',
  authenticate({ allow: ['permission.write'] }),
  validateParams(deletePermissionParamSchema),
  validateParams(deletePermissionParamSchema),
  deletePermission
);

export { permissionRouter };
