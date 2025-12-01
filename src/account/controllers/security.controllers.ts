import { controller } from '@/middleware/controller.middleware';
import type {
	ToggleTwoFactorParams,
	ToggleTwoFactorResBody,
} from '../dto/toggleTwoFactor.dto';
import User from '@/services/User.service';
import HttpStatus from '@/types/HttpStatus.enum';

export const toggleTwoFactor = controller<
	undefined,
	ToggleTwoFactorResBody,
	ToggleTwoFactorParams
>(async (req, res, _next) => {
	const isEnabled = req.params.switch === 'on'; // else 'off' -> false

	await new User(req.user.id).update({
		twoFactorEnabled: isEnabled,
	});

	res.status(HttpStatus.OK).json({
		success: true,
		data: {},
	});
});
