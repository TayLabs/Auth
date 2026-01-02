import { controller } from '@/middleware/controller.middleware';
import Profile from '../services/Profile.service';
import {
  UpdateProfileReqBody,
  UpdateProfileResBody,
} from '../dto/profile/update.dto';
import HttpStatus from '@/types/HttpStatus.enum';
import { GetProfileResBody } from '../dto/profile/get.dto';

export const get = controller<undefined, GetProfileResBody>(
  async (req, res, _next) => {
    const profile = await new Profile(req.user.id).get();

    res.status(HttpStatus.OK).json({
      success: true,
      data: {
        profile,
      },
    });
  }
);

export const update = controller<UpdateProfileReqBody, UpdateProfileResBody>(
  async (req, res, _next) => {
    const profile = await new Profile(req.user.id).update(req.body);

    res.status(HttpStatus.OK).json({
      success: true,
      data: {
        profile,
      },
    });
  }
);
