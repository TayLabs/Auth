import { controller } from '@/middleware/controller.middleware';
import {
  RegisterServiceReqBody,
  RegisterServiceResBody,
} from '../dto/services/register.dto';
import HttpStatus from '@/types/HttpStatus.enum';
import {
  DeleteServiceReqParams,
  DeleteServiceResBody,
} from '../dto/services/delete.dto';
import {
  UpdateServiceReqBody,
  UpdateServiceResBody,
} from '../dto/services/update.dto';
import { GetServiceResBody } from '../dto/services/get.dto';
import { GetAllServicesResBody } from '../dto/services/getAll.dto';

export const getAll = controller<{}, GetAllServicesResBody>(
  async (req, res, _next) => {
    res.status(HttpStatus.CREATED).json({
      success: true,
      data: {
        services: [
          {
            id: '5353a041-01b1-4b77-9486-14d953929352',
            name: 'auth',
          },
        ],
      },
    });
  }
);

export const get = controller<{}, GetServiceResBody>(
  async (req, res, _next) => {
    res.status(HttpStatus.CREATED).json({
      success: true,
      data: {
        service: {
          id: '5353a041-01b1-4b77-9486-14d953929352',
          name: 'auth',
        },
      },
    });
  }
);

export const register = controller<
  RegisterServiceReqBody,
  RegisterServiceResBody
>(async (req, res, _next) => {
  res.status(HttpStatus.CREATED).json({
    success: true,
    data: {
      service: {
        id: '5353a041-01b1-4b77-9486-14d953929352',
        name: 'auth',
      },
    },
  });
});

export const update = controller<UpdateServiceReqBody, UpdateServiceResBody>(
  async (req, res, _next) => {
    res.status(HttpStatus.CREATED).json({
      success: true,
      data: {
        service: {
          id: '5353a041-01b1-4b77-9486-14d953929352',
          name: 'auth',
        },
      },
    });
  }
);

export const deleteService = controller<
  {},
  DeleteServiceResBody,
  DeleteServiceReqParams
>(async (req, res, _next) => {
  res.status(HttpStatus.CREATED).json({
    success: true,
    data: {
      service: {
        id: '5353a041-01b1-4b77-9486-14d953929352',
        name: 'auth',
      },
    },
  });
});
