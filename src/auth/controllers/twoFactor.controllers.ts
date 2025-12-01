import { controller } from '@/middleware/controller.middleware';
import HttpStatus from '@/types/HttpStatus.enum';
import TOTP from '@/services/TOTP.service';
import {
  TOTPValidateReqBody,
  TOTPValidateResBody,
} from '../dto/totpValidate.dto';
import Token from '../services/Token.service';

export const totpValidateController = controller<
  TOTPValidateReqBody,
  TOTPValidateResBody
>(async (req, res, _next) => {
  await new TOTP(req).validate(req.body.code);

  const { accessToken } = await new Token(req, res).refresh({ resolve: '2fa' });

  res.status(HttpStatus.OK).json({
    success: true,
    data: {
      accessToken,
    },
  });
});
