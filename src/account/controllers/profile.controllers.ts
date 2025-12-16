import { controller } from '@/middleware/controller.middleware';
import Profile from '../services/Profile.service';
import {
  UpdateProfileReqBody,
  UpdateProfileResBody,
} from '../dto/profile/update.dto';

export const update = controller<UpdateProfileReqBody, UpdateProfileResBody>(
  async (req, res, _next) => {
    const profile = await new Profile(req.user.id).update(req.body);

    res.status(200).json({
      success: true,
      data: {
        profile,
      },
    });
  }
);
