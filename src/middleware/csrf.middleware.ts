import csurf from '@dr.pogodin/csurf';
import { type RequestHandler } from 'express';

function isMatch(str: string, rule: string) {
  var escapeRegex = (str: string) =>
    str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
  return new RegExp(
    '^' + rule.split('*').map(escapeRegex).join('.*') + '$'
  ).test(str);
}

const exclude = ['api/v1/services/*/keys'];

export const csrf: RequestHandler = (req, res, next) => {
  if (exclude.findIndex((path) => isMatch(req.path, path))) return next();

  return csurf({
    cookie: {
      key: '_csrf',
      path: '/',
      httpOnly: true, // CSRF cookie can't be accessed via JavaScript
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    },
  })(req, res, next);
};
