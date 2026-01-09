import { controller } from '@/middleware/controller.middleware';
import { GetAllUsersResBody } from '../dto/users/getAll.dto';
import User from '@/services/User.service';
import HttpStatus from '@/types/HttpStatus.enum';
import {
  ForcePasswordResetReqParams,
  ForcePasswordResetResBody,
} from '../dto/users/forcePasswordReset.dto';
import {
  UpdateRolesReqBody,
  UpdateRolesReqParams,
  UpdateRolesResBody,
} from '../dto/users/updateRoles.dto';
import { GetRolesReqParams, GetRolesResBody } from '../dto/users/getRoles.dto';

export const getAll = controller<undefined, GetAllUsersResBody>(
  async (_req, res, _next) => {
    const users = await User.getAll();

    for (let i = 0; i < users.length; i++) {
      const user = users[i];

      delete user.passwordHash;
    }

    res.status(HttpStatus.OK).json({
      success: true,
      data: {
        users,
      },
    });
  }
);

export const forcePasswordReset = controller<
  undefined,
  ForcePasswordResetResBody,
  ForcePasswordResetReqParams
>(async (req, res, _next) => {
  await new User(req.params.userId).forcePasswordReset(true);

  res.status(HttpStatus.OK).json({
    success: true,
    data: undefined,
  });
});

export const getRoles = controller<
  undefined,
  GetRolesResBody,
  GetRolesReqParams
>(async (req, res, _next) => {
  const user = await new User(req.params.userId).getRoles();

  res.status(HttpStatus.OK).json({
    success: true,
    data: {
      user,
    },
  });
});

export const updateRoles = controller<
  UpdateRolesReqBody,
  UpdateRolesResBody,
  UpdateRolesReqParams
>(async (req, res, _next) => {
  const roles = await new User(req.params.userId).updateRoles(req.body);

  res.status(HttpStatus.OK).json({
    success: true,
    data: {
      roles,
    },
  });
});
