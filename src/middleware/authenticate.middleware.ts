// import { accessTokenCookie } from '@/auth/constants/cookies';
import Token, { type PendingActionType } from '@/auth/services/Token.service';
import AppError from '@/types/AppError';
import env from '@/types/env';
import HttpStatus from '@/types/HttpStatus.enum';
import { RequestHandler } from 'express';

const authenticate: (options?: {
  allow?: string[];
  acceptPending?: NonNullable<PendingActionType>[];
}) => RequestHandler = (options) => (req, res, next) => {
  try {
    // Parse Access Token
    const accessToken: string | undefined =
      req.headers.authorization?.split(' ')[1];
    // || req.cookies[accessTokenCookie.name];

    if (!accessToken) {
      throw new AppError(
        'Missing or Invalid Access Token',
        HttpStatus.UNAUTHORIZED
      );
    }

    // Verify Access Token
    const payload = new Token(req, res).verify(accessToken);

    if (payload.pending === '2fa' && !options?.acceptPending?.includes('2fa')) {
      throw new AppError('Finish Two Factor', HttpStatus.UNAUTHORIZED);
    } else if (
      payload.pending === 'passwordReset' &&
      !options?.acceptPending?.includes('passwordReset')
    ) {
      throw new AppError('Reset Password', HttpStatus.UNAUTHORIZED);
    } else if (
      payload.pending === 'emailVerification' &&
      !options?.acceptPending?.includes('emailVerification')
    ) {
      throw new AppError('Verify Email', HttpStatus.UNAUTHORIZED);
    }

    // check user scopes
    let allowed = false;
    if (options?.allow) {
      for (const permission of options.allow) {
        if (payload.scopes.includes(`${env.SERVICE_NAME}:${permission}`))
          allowed = true;
      }
    } else {
      allowed = true; // if no scopes are listed default to allowed (true)
    }
    if (!allowed) {
      throw new AppError(
        'Not allowed to view this route',
        HttpStatus.FORBIDDEN
      );
    }

    req.user = { id: payload.userId, scopes: payload.scopes };

    next();
  } catch (err) {
    next(err);
  }
};

export default authenticate;
