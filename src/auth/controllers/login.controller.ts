import type { LoginReqBody, LoginResBody } from '../dto/login.dto';
import { controller } from '@/middleware/controller.middleware';
import HttpStatus from '@/types/HttpStatus.enum';

export const loginController = controller<LoginReqBody, LoginResBody>(
  (req, res, _next) => {
    // Login logic here

    res.status(HttpStatus.CREATED).json({
      success: true,
      data: {
        userId: '00000000-0000-0000-0000-000000000000',
        email: req.body.email,
        firstName: 'John',
        lastName: 'Doe',
        userName:
          req.body.email.split('@')[0] + Math.floor(Math.random() * 10) * 10,
      },
    });
  }
);
