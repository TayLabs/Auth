import env from '@/types/env';
import csurf from '@dr.pogodin/csurf';

export const csrf = csurf({
  cookie: {
    key: '_csrf',
    path: '/',
    httpOnly: true, // CSRF cookie can't be accessed via JavaScript
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  },
});
