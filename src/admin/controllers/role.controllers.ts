import { controller } from '@/middleware/controller.middleware';
import HttpStatus from '@/types/HttpStatus.enum';
import type { AddRoleReqBody, AddRoleResBody } from '../dto/roles/add.dto';
import type {
  DeleteRoleReqParams,
  DeleteRoleResBody,
} from '../dto/roles/delete.dto';
import type {
  UpdateRoleReqBody,
  UpdateRoleResBody,
} from '../dto/roles/update.dto';
import type { GetRoleResBody } from '../dto/roles/get.dto';
import type { GetAllRolesResBody } from '../dto/roles/getAll.dto';

export const getAll = controller<{}, GetAllRolesResBody>(
  async (req, res, _next) => {
    res.status(HttpStatus.CREATED).json({
      success: true,
      data: {
        roles: [
          {
            id: '5353a041-01b1-4b77-9486-14d953929352',
            name: 'auth',
          },
        ],
      },
    });
  }
);

export const get = controller<{}, GetRoleResBody>(async (req, res, _next) => {
  res.status(HttpStatus.CREATED).json({
    success: true,
    data: {
      role: {
        id: '5353a041-01b1-4b77-9486-14d953929352',
        name: 'auth',
      },
    },
  });
});

export const add = controller<AddRoleReqBody, AddRoleResBody>(
  async (req, res, _next) => {
    res.status(HttpStatus.CREATED).json({
      success: true,
      data: {
        role: {
          id: '5353a041-01b1-4b77-9486-14d953929352',
          name: 'auth',
        },
      },
    });
  }
);

export const update = controller<UpdateRoleReqBody, UpdateRoleResBody>(
  async (req, res, _next) => {
    res.status(HttpStatus.CREATED).json({
      success: true,
      data: {
        role: {
          id: '5353a041-01b1-4b77-9486-14d953929352',
          name: 'auth',
        },
      },
    });
  }
);

export const deleteRole = controller<
  {},
  DeleteRoleResBody,
  DeleteRoleReqParams
>(async (req, res, _next) => {
  res.status(HttpStatus.CREATED).json({
    success: true,
    data: {
      role: {
        id: '5353a041-01b1-4b77-9486-14d953929352',
        name: 'auth',
      },
    },
  });
});
