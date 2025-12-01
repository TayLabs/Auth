import { controller } from '@/middleware/controller.middleware';
import HttpStatus from '@/types/HttpStatus.enum';
import TOTP from '@/services/TOTP.service';
import type { UUID } from 'node:crypto';
import type {
  TOTPCreateReqBody,
  TOTPCreateResBody,
} from '../dto/totpCreate.dto';
import type {
  TOTPRemoveReqBody,
  TOTPRemoveReqParams,
  TOTPRemoveResBody,
} from '../dto/totpRemove.dto';
import { TOTPVerifyReqBody, TOTPVerifyResBody } from '../dto/totpVerify.dto';

export const totpCreateController = controller<
  TOTPCreateReqBody,
  TOTPCreateResBody
>(async (req, res, _next) => {
  const { totpTokenRecord, qrCode } = await new TOTP(req).create();

  res.status(HttpStatus.CREATED).json({
    success: true,
    data: {
      totpTokenRecord,
      qrCode,
    },
  });
});

export const totpVerifyController = controller<
  TOTPVerifyReqBody,
  TOTPVerifyResBody,
  { totpTokenId: UUID }
>(async (req, res, _next) => {
  await new TOTP(req).verify(req.body.code);

  res.status(HttpStatus.OK).json({
    success: true,
    data: {},
  });
});

export const totpRemoveController = controller<
  TOTPRemoveReqBody,
  TOTPRemoveResBody,
  TOTPRemoveReqParams
>(async (req, res, _next) => {
  const { id } = await new TOTP(req).remove(req.params.totpTokenId);

  res.status(HttpStatus.OK).json({
    success: true,
    data: { id },
  });
});
