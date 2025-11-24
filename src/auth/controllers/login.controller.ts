import { controller } from '@/middleware/controller.middleware';
import HttpStatus from '@/types/HttpStatus.enum';
import type { LoginReqBody, LoginResBody } from '../dto/login.dto';
import type { SignupReqBody, SignupResBody } from '../dto/signup.dto';
import User from '../utils/User.util';
import Token from '../utils/Token.util';

// /auth/login
export const loginController = controller<LoginReqBody, LoginResBody>(
	async (req, res, _next) => {
		// Login logic here
		const user = await User.login(req.body.email, req.body.password);

		// Issue new tokens
		const { accessToken, refreshToken, deviceId } = await new Token(req).create(
			user.id
		);

		// TODO: set cookies with request objects, also move cookie names to constants

		res.status(HttpStatus.OK).json({
			success: true,
			data: {
				userId: '00000000-0000-0000-0000-000000000000',
				email: req.body.email,
				firstName: 'John',
				lastName: 'Doe',
				userName: req.body.email.split('@')[0],
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

		res.status(HttpStatus.CREATED).json({
			success: true,
			data: {
				userId: user.id,
				email: user.email,
				firstName: user.profile.firstName,
				lastName: user.profile.lastName,
				username: user.profile.username,
			},
		});
	}
);
