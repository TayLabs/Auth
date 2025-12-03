import { controller } from '@/middleware/controller.middleware';
import {
  type LogoutReqQueryParams,
  type LogoutResBody,
} from '../dto/logout.dto';
import { deviceCookie } from '../constants/cookies';
import AppError from '@/types/AppError';
import HttpStatus from '@/types/HttpStatus.enum';
import Token from '../services/Token.service';
import type { UUID } from 'node:crypto';
import { LogoutAllResBody } from '../dto/logoutAll.dto';

export const logout = controller<
  undefined,
  LogoutResBody,
  {},
  LogoutReqQueryParams
>(async (req, res, _next) => {
  const deviceId: UUID | undefined =
    req.query.deviceId || req.cookies[deviceCookie.name];

  if (!deviceId) {
    throw new AppError('Device Id is required', HttpStatus.BAD_REQUEST);
  }

  await new Token(req, res).invalidate(deviceId);
});

export const logoutAll = controller<undefined, LogoutAllResBody>(
  async (req, res, _next) => {
    await new Token(req, res).invalidateAll();

    res.status(HttpStatus.OK).json({
      success: true,
      data: { message: 'All devices logged out successfully' },
    });
  }
);
