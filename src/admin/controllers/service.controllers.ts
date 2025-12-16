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
  UpdateServiceReqParams,
  UpdateServiceResBody,
} from '../dto/services/update.dto';
import {
  GetServiceReqParams,
  GetServiceResBody,
} from '../dto/services/get.dto';
import { GetAllServicesResBody } from '../dto/services/getAll.dto';
import Service from '../services/Service.service';

export const getAll = controller<{}, GetAllServicesResBody>(
  async (req, res, _next) => {
    const services = await Service.getAll();

    res.status(HttpStatus.CREATED).json({
      success: true,
      data: {
        services,
      },
    });
  }
);

export const get = controller<{}, GetServiceResBody, GetServiceReqParams>(
  async (req, res, _next) => {
    const service = await new Service(req.params.serviceId).get();

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
  const service = await Service.create(req.body);

  res.status(HttpStatus.CREATED).json({
    success: true,
    data: {
      service,
    },
  });
});

export const update = controller<
  UpdateServiceReqBody,
  UpdateServiceResBody,
  UpdateServiceReqParams
>(async (req, res, _next) => {
  const service = await new Service(req.params.serviceId).update(req.body);

  res.status(HttpStatus.CREATED).json({
    success: true,
    data: {
      service,
    },
  });
});

export const deleteService = controller<
  {},
  DeleteServiceResBody,
  DeleteServiceReqParams
>(async (req, res, _next) => {
  const service = await new Service(req.params.serviceId).delete();

  res.status(HttpStatus.CREATED).json({
    success: true,
    data: {
      service,
    },
  });
});
