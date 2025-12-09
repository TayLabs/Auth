import { controller } from '@/middleware/controller.middleware';
import type { DeleteAccountResBody } from '../dto/deleteAccount.dto';
import HttpStatus from '@/types/HttpStatus.enum';
import User from '@/services/User.service';

export const deleteAccount = controller<{}, DeleteAccountResBody>(
  async (req, res, _next) => {
    const user = await new User(req.user.id).delete(); // Delete's all linked records with cascade delete

    res.status(HttpStatus.OK).json({
      success: true,
      data: {
        user,
      },
    });
  }
);
