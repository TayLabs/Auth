import { controller } from '@/middleware/controller.middleware';
import HttpStatus from '@/types/HttpStatus.enum';
import type { LoginReqBody, LoginResBody } from '../dto/login.dto';
import type { SignupReqBody, SignupResBody } from '../dto/signup.dto';
import type { RefreshReqBody, RefreshResBody } from '../dto/refresh.dto';
import type {
	TOTPCreateReqBody,
	TOTPCreateResBody,
} from '../dto/totpCreate.dto';
import User from '../services/User.service';
import Token from '../services/Token.service';
import TOTP from '../services/TOTP.service';

// /auth/login
export const loginController = controller<LoginReqBody, LoginResBody>(
	async (req, res, _next) => {
		// Login logic here
		const user = await User.login(req.body.email, req.body.password);

		// Issue new tokens (partial if 2fa is enabled)
		const { accessToken } = await new Token(req, res).create(user);

		res.status(HttpStatus.OK).json({
			success: true,
			data: {
				user: {
					id: user.id,
					email: user.email,
					firstName: user.profile.firstName,
					lastName: user.profile.lastName,
					userName: user.profile.username,
				},
				accessToken,
			},
		});
	}
);

// /auth/signup
export const signupController = controller<SignupReqBody, SignupResBody>(
	async (req, res, _next) => {
		const user = await User.create(req.body.email, req.body.password, {
			firstName: req.body.firstName,
			lastName: req.body.lastName,
		});

		const { accessToken } = await new Token(req, res).create(user);

		res.status(HttpStatus.CREATED).json({
			success: true,
			data: {
				user: {
					id: user.id,
					email: user.email,
					firstName: user.profile.firstName,
					lastName: user.profile.lastName,
					username: user.profile.username,
				},
				accessToken,
			},
		});
	}
);

export const refreshController = controller<RefreshReqBody, RefreshResBody>(
	async (req, res, _next) => {
		const { accessToken } = await new Token(req, res).refresh();

		res.status(HttpStatus.OK).json({
			success: true,
			data: {
				accessToken,
			},
		});
	}
);

export const totpCreateController = controller<
	TOTPCreateReqBody,
	TOTPCreateResBody
>(async (req, res, _next) => {
	const { totpTokenRecord, qrCode } = await new TOTP(req.user.id).create();

	// TODO: Remove access token from being sent back and prompt the user to verify before properly adding the token
	const { accessToken } = await new Token(req, res).refresh({ resolve: '2fa' });

	res.status(HttpStatus.OK).json({
		success: true,
		data: {
			totpTokenRecord,
			qrCode,
			accessToken,
		},
	});
});
