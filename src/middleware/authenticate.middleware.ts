import { accessTokenCookie } from '@/auth/constants/cookies';
import Token, { type PartialTokenClaim } from '@/auth/services/Token.service';
import AppError from '@/types/AppError';
import HttpStatus from '@/types/HttpStatus.enum';
import { RequestHandler } from 'express';

const authenticate: (overrideClaim?: PartialTokenClaim) => RequestHandler =
	(overrideClaim) => (req, res, next) => {
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

			if (payload.claim !== 'full' && payload.claim !== overrideClaim) {
				throw new AppError('Invalid Access Token', HttpStatus.UNAUTHORIZED);
			}
			next();
		} catch (err) {
			next(err);
		}
	};

export default authenticate;
