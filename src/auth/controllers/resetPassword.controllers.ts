import { controller } from '@/middleware/controller.middleware';
import {
	SendResetLinkReqBody,
	type SendResetLinkResBody,
} from '../dto/password/sendResetLink.dto';
import { sendMail } from '@/config/tayLab/mail';
import {
	ResetReqBody,
	ResetReqQueryParams,
	ResetResBody,
} from '../dto/password/reset.dto';
import ResetLink from '../utils/ResetLink.utils';
import HttpStatus from '@/types/HttpStatus.enum';
import User from '@/services/User.service';
import { ChangeReqBody, ChangeResBody } from '../dto/password/change.dto';
import Token from '../services/Token.service';
import { selectedSessionCookie, sessionCookie } from '../constants/cookies';

export const sendLink = controller<SendResetLinkReqBody, SendResetLinkResBody>(
	async (req, res, _next) => {
		const { token, userId } = await ResetLink.create(req.body.email);

		const resetUrl = `${req.body.linkBaseUrl}?t=${token}`;

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

	req.user.id = (await ResetLink.verify(token)).userId;

	await new User(req.user.id).resetPassword(req.body.password);

	// Logs out all sessions for this user (since password is reset)
	await new Token(req, res).invalidateAll();

	res.status(HttpStatus.OK).json({
		success: true,
		data: {},
	});
});

export const change = controller<ChangeReqBody, ChangeResBody>(
	async (req, res, _next) => {
		const userId = req.user.id;

		await new User(userId).changePassword(
			req.body.currentPassword,
			req.body.password
		);

		// Logs out all sessions for this user (since password is reset)
		await new Token(req, res).invalidateAll();

		res.status(HttpStatus.OK).json({
			success: true,
			data: {},
		});
	}
);
