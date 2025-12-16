import { controller } from '@/middleware/controller.middleware';
import HttpStatus from '@/types/HttpStatus.enum';
import type {
  AddRoleReqBody,
  AddRoleReqParams,
  AddRoleResBody,
} from '../dto/roles/add.dto';
import type {
  DeleteRoleReqParams,
  DeleteRoleResBody,
} from '../dto/roles/delete.dto';
import type {
  UpdateRoleReqBody,
  UpdateRoleReqParams,
  UpdateRoleResBody,
} from '../dto/roles/update.dto';
import type { GetRoleReqParams, GetRoleResBody } from '../dto/roles/get.dto';
import type {
  GetAllRolesResBody,
  GetAllRolesReqParams,
} from '../dto/roles/getAll.dto';
import Role from '../services/Role.service';

export const getAll = controller<{}, GetAllRolesResBody, GetAllRolesReqParams>(
  async (req, res, _next) => {
    const roles = await new Role(req.params.serviceId).getAll();

    res.status(HttpStatus.CREATED).json({
      success: true,
      data: {
        roles,
      },
    });
  }
);

export const get = controller<{}, GetRoleResBody, GetRoleReqParams>(
  async (req, res, _next) => {
    const role = await new Role(req.params.serviceId, req.params.roleId).get();

    res.status(HttpStatus.CREATED).json({
      success: true,
      data: {
        role,
      },
    });
  }
);

export const add = controller<AddRoleReqBody, AddRoleResBody, AddRoleReqParams>(
  async (req, res, _next) => {
    const role = await new Role(req.params.serviceId).create(req.body);

    res.status(HttpStatus.CREATED).json({
      success: true,
      data: {
        role,
      },
    });
  }
);

export const update = controller<
  UpdateRoleReqBody,
  UpdateRoleResBody,
  UpdateRoleReqParams
>(async (req, res, _next) => {
  const role = await new Role(req.params.roleId).update({
    ...req.body,
    serviceId: req.params.serviceId,
  });

  res.status(HttpStatus.CREATED).json({
    success: true,
    data: {
      role,
    },
  });
});

export const deleteRole = controller<
  {},
  DeleteRoleResBody,
  DeleteRoleReqParams
>(async (req, res, _next) => {
  const role = await new Role(req.params.serviceId, req.params.roleId).delete();

  res.status(HttpStatus.CREATED).json({
    success: true,
    data: {
      role,
    },
  });
});
