import { controller } from '@/middleware/controller.middleware';
import HttpStatus from '@/types/HttpStatus.enum';
import type { LoginReqBody, LoginResBody } from '../dto/login.dto';
import type { SignupReqBody, SignupResBody } from '../dto/signup.dto';
import type { RefreshReqBody, RefreshResBody } from '../dto/refresh.dto';
import User from '@/services/User.service';
import Token from '../services/Token.service';
import EmailVerification from '../services/EmailVerification.service';
import { sendMail } from '@/config/tayLab/mail';

// /auth/login
export const loginController = controller<LoginReqBody, LoginResBody>(
	async (req, res, _next) => {
		// Login logic here
		const user = await User.login(req.body.email, req.body.password);

		// Issue new tokens (partial if 2fa is enabled)
		const { pending, accessToken } = await new Token(req, res).create(user);

		res.status(HttpStatus.OK).json({
			success: true,
			data: {
				pending,
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

		const { pending, accessToken } = await new Token(req, res).create(user);

		// Send email verification email
		const { token, email } = await EmailVerification.create(user.id);

		const resetUrl = `${req.body.linkBaseUrl}?t=${token}`;

		sendMail({
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

		res.status(HttpStatus.CREATED).json({
			success: true,
			data: {
				pending,
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
		const { pending, accessToken } = await new Token(req, res).refresh();

		res.status(HttpStatus.OK).json({
			success: true,
			data: {
				pending,
				accessToken,
			},
		});
	}
);
