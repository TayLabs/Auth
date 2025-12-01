import { controller } from '@/middleware/controller.middleware';
import {
  SendResetLinkReqBody,
  type SendResetLinkResBody,
} from '../dto/sendResetLink.dto';
import { sendMail } from '@/config/mail';
import {
  ResetReqBody,
  ResetReqQueryParams,
  ResetResBody,
} from '../dto/reset.dto';
import ResetLink from '../utils/ResetLink.utils';
import env from '@/types/env';
import HttpStatus from '@/types/HttpStatus.enum';
import AppError from '@/types/AppError';
import User from '@/services/User.service';

export const sendLink = controller<SendResetLinkReqBody, SendResetLinkResBody>(
  async (req, res, _next) => {
    if (!req.body.linkBaseUrl.startsWith(env.FRONTEND_URL)) {
      throw new AppError('Malformed linkBaseUrl', HttpStatus.FORBIDDEN);
    }

    const { token, userId } = await ResetLink.create(req.body.email);

    const resetUrl = `${req.body.linkBaseUrl}?t=${token}&u=${userId}`;

    await sendMail({
      to: {
        email: req.body.email,
      },
      subject: 'Reset your password | TayLabs/Auth',
      text: `Visit ${resetUrl} resetUrl to reset your password`,
      html: `
        <main>
          <h5>Reset your password</h5>
          <p><a href="${resetUrl}" target="_blank">Click here</a> to reset your password</p>
        </main>
      `,
    });

    res.status(HttpStatus.OK).json({
      success: true,
      data: {},
    });
  }
);

export const reset = controller<
  ResetReqBody,
  ResetResBody,
  {},
  ResetReqQueryParams
>(async (req, res, _next) => {
  const { t: token } = req.query;

  const { userId } = await ResetLink.verify(token);

  await new User(userId).resetPassword(req.body.password);

  res.status(HttpStatus.OK).json({
    success: true,
    data: {},
  });
});
