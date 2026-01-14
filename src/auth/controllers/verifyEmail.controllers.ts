import { controller } from '@/middleware/controller.middleware';
import type {
  VerifyEmailReqQueryParams,
  VerifyEmailResBody,
} from '../dto/verifyEmail.dto';
import HttpStatus from '@/types/HttpStatus.enum';
import EmailVerification from '../services/EmailVerification.service';
import { sendMail } from '@/config/tayLab/mail';
import {
  SendVerifyEmailReqBody,
  SendVerifyEmailResBody,
} from '../dto/sendVerifyEmail.dto';
import Token from '../services/Token.service';

export const sendVerify = controller<
  SendVerifyEmailReqBody,
  SendVerifyEmailResBody
>(async (req, res, _next) => {
  const { token, email } = await EmailVerification.create(req.user.id);

  const resetUrl = `${req.body.linkBaseUrl}?t=${token}`;

  await sendMail({
    to: {
      email,
    },
    subject: 'Reset your password | TayLabs/Auth',
    text: `Visit ${resetUrl} to verify your email`,
    html: `
            <main>
                <h5>Verify your email</h5>
                <p><a href="${resetUrl}" target="_blank">Click here</a> to verify your email</p>
            </main>
        `,
  });

  res.status(HttpStatus.OK).json({
    success: true,
    data: undefined,
  });
});

export const verify = controller<
  undefined,
  VerifyEmailResBody,
  {},
  VerifyEmailReqQueryParams
>(async (req, res, _next) => {
  await EmailVerification.verify(req.query.t);

  await new Token(req, res).refresh({ resolve: 'emailVerification' });

  res.status(HttpStatus.OK).json({
    success: true,
    data: {},
  });
});
