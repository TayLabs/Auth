import { controller } from '@/middleware/controller.middleware';
import type {
	VerifyEmailReqQueryParams,
	VerifyEmailResBody,
} from '../dto/verifyEmail.dto';
import HttpStatus from '@/types/HttpStatus.enum';
import EmailVerification from '../services/EmailVerification.service';
import { sendMail } from '@/config/mail';
import {
	SendVerifyEmailReqBody,
	SendVerifyEmailResBody,
} from '../dto/sendVerifyEmail.dto';
import env from '@/types/env';
import AppError from '@/types/AppError';

export const sendVerify = controller<
	SendVerifyEmailReqBody,
	SendVerifyEmailResBody
>(async (req, res, _next) => {
	if (!req.body.linkBaseUrl.startsWith(env.FRONTEND_URL)) {
		throw new AppError('Malformed linkBaseUrl', HttpStatus.FORBIDDEN);
	}
	const { token, email } = await EmailVerification.create(req.user.id);

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

	res.status(HttpStatus.OK).json({
		success: true,
		data: {},
	});
});

export const verify = controller<
	undefined,
	VerifyEmailResBody,
	{},
	VerifyEmailReqQueryParams
>(async (req, res, _next) => {
	await EmailVerification.verify(req.query.t);

	res.status(HttpStatus.OK).json({
		success: true,
		data: {},
	});
});
