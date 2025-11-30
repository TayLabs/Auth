import { controller } from '@/middleware/controller.middleware';
import HttpStatus from '@/types/HttpStatus.enum';
import TOTP from '@/services/TOTP.service';
import type {
	TOTPVerifyReqBody,
	TOTPVerifyResBody,
} from '../dto/totpVerify.dto';
import type { UUID } from 'node:crypto';

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
