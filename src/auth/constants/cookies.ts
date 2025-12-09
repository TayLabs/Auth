import type { CookieOptions } from 'express';
import parseTTL from '../utils/parseTTL.utils';
import env from '@/types/env';

type Cookie = {
  name: string | ((sessionId: string) => string);
  options: CookieOptions;
};

export const deviceCookie: Cookie = {
  name: '_d_identifier',
  options: {
    expires: new Date(2038, 12, 31), // Never expires (not future proof but account's for the unix Year 2038 problem in browsers)
    httpOnly: false,
  },
};

export const selectedSessionCookie: Cookie = {
  name: '_selected_s',
  options: {
    expires: new Date(2038, 12, 31), // Never expires (not future proof but account's for the unix Year 2038 problem in browsers)
    httpOnly: false,
  },
};

export const sessionCookie: Cookie = {
  name: (sessionId: string) => `_s_${sessionId}`,
  options: {
    expires: new Date(
      Date.now() + parseTTL(env.REFRESH_TOKEN_TTL).milliseconds
    ),
    httpOnly: true,
  },
};

export const accessTokenCookie: Cookie = {
  name: '_access_t',
  options: {
    expires: new Date(Date.now() + parseTTL(env.ACCESS_TOKEN_TTL).milliseconds),
    httpOnly: false,
  },
};
