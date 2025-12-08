import { controller } from '@/middleware/controller.middleware';
import {
  AddPermissionReqBody,
  AddPermissionResBody,
} from '../dto/permissions/add.dto';
import HttpStatus from '@/types/HttpStatus.enum';
import {
  DeletePermissionReqParams,
  DeletePermissionResBody,
} from '../dto/permissions/delete.dto';
import {
  UpdatePermissionReqBody,
  UpdatePermissionResBody,
} from '../dto/permissions/update.dto';
import { GetPermissionResBody } from '../dto/permissions/get.dto';
import { GetAllPermissionsResBody } from '../dto/permissions/getAll.dto';

export const getAll = controller<{}, GetAllPermissionsResBody>(
  async (req, res, _next) => {
    res.status(HttpStatus.CREATED).json({
      success: true,
      data: {
        permissions: [
          {
            id: '5353a041-01b1-4b77-9486-14d953929352',
            resource: 'user',
            action: 'read',
          },
        ],
      },
    });
  }
);

export const get = controller<{}, GetPermissionResBody>(
  async (req, res, _next) => {
    res.status(HttpStatus.CREATED).json({
      success: true,
      data: {
        permission: {
          id: '5353a041-01b1-4b77-9486-14d953929352',
          resource: 'user',
          action: 'read',
        },
      },
    });
  }
);

export const add = controller<AddPermissionReqBody, AddPermissionResBody>(
  async (req, res, _next) => {
    res.status(HttpStatus.CREATED).json({
      success: true,
      data: {
        permission: {
          id: '5353a041-01b1-4b77-9486-14d953929352',
          resource: 'user',
          action: 'read',
        },
      },
    });
  }
);

export const update = controller<
  UpdatePermissionReqBody,
  UpdatePermissionResBody
>(async (req, res, _next) => {
  res.status(HttpStatus.CREATED).json({
    success: true,
    data: {
      permission: {
        id: '5353a041-01b1-4b77-9486-14d953929352',
        resource: 'user',
        action: 'read',
      },
    },
  });
});

export const deletePermission = controller<
  {},
  DeletePermissionResBody,
  DeletePermissionReqParams
>(async (req, res, _next) => {
  res.status(HttpStatus.CREATED).json({
    success: true,
    data: {
      permission: {
        id: '5353a041-01b1-4b77-9486-14d953929352',
        resource: 'user',
        action: 'read',
      },
    },
  });
});
