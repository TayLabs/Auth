import { controller } from '@/middleware/controller.middleware';
import {
	type LogoutReqQueryParams,
	type LogoutResBody,
} from '../dto/logout.dto';
import {
	accessTokenCookie,
	deviceCookie,
	selectedSessionCookie,
	sessionCookie,
} from '../constants/cookies';
import AppError from '@/types/AppError';
import HttpStatus from '@/types/HttpStatus.enum';
import Token from '../services/Token.service';
import type { UUID } from 'node:crypto';
import { LogoutAllResBody } from '../dto/logoutAll.dto';

export const logout = controller<
	undefined,
	LogoutResBody,
	{},
	LogoutReqQueryParams
>(async (req, res, _next) => {
	const deviceId: UUID | undefined =
		req.query.deviceId || req.cookies[deviceCookie.name];
	const isDeviceLogout = Boolean(req.query.deviceId);

	if (!deviceId) {
		throw new AppError('Device Id is required', HttpStatus.BAD_REQUEST);
	}

	const result = await new Token(req, res).invalidate(deviceId);

	if (!isDeviceLogout && result.sessionId) {
		res.clearCookie(accessTokenCookie.name);
		res.clearCookie(selectedSessionCookie.name);
		res.clearCookie(sessionCookie(result.sessionId).name);
	}

	res.status(HttpStatus.OK).json({
		success: true,
		data: {
			message: 'Logged out successfully',
		},
	});
});

export const logoutAll = controller<undefined, LogoutAllResBody>(
	async (req, res, _next) => {
		const result = await new Token(req, res).invalidateAll();

		const sessionId = req.cookies[selectedSessionCookie.name] as
			| UUID
			| undefined;
		if (sessionId) {
			res.clearCookie(accessTokenCookie.name);
			res.clearCookie(selectedSessionCookie.name);
			res.clearCookie(sessionCookie(sessionId).name);
		}

		res.status(HttpStatus.OK).json({
			success: true,
			data: { message: 'All devices logged out successfully' },
		});
	}
);
