import { accessTokenCookie } from '@/auth/constants/cookies';
import Token from '@/auth/services/Token.service';
import AppError from '@/types/AppError';
import HttpStatus from '@/types/HttpStatus.enum';
import { RequestHandler } from 'express';

const authenticate: RequestHandler = (req, res, next) => {
	try {
		// Parse Access Token
		const accessToken: string | undefined =
			req.headers.authorization?.split(' ')[1] ||
			req.cookies[accessTokenCookie.name];

		if (!accessToken) {
			throw new AppError(
				'Missing or Invalid Access Token',
				HttpStatus.UNAUTHORIZED
			);
		}

		// Verify Access Token
		const payload = new Token(req, res).verify(accessToken);

		req.user.id = payload.userId;
		next();
	} catch (err) {
		next(err);
	}
};

export default authenticate;
