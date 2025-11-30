import { controller } from '@/middleware/controller.middleware';
import HttpStatus from '@/types/HttpStatus.enum';
import TOTP from '@/services/TOTP.service';
import type { UUID } from 'node:crypto';
import Token from '@/services/Token.service';
import type {
	TOTPCreateReqBody,
	TOTPCreateResBody,
} from '../dto/totpCreate.dto';
import type {
	TOTPRemoveReqBody,
	TOTPRemoveReqParams,
	TOTPRemoveResBody,
} from '../dto/totpRemove.dto';
import type {
	TOTPValidateReqBody,
	TOTPValidateResBody,
} from '../dto/totpValidate.dto';

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
