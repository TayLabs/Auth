import csurf from 'csurf';
import { type RequestHandler } from 'express';

function isMatch(str: string, rule: string) {
	var escapeRegex = (str: string) =>
		str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
	return new RegExp(
		'^' + rule.split('*').map(escapeRegex).join('.*') + '$',
	).test(str);
}

const exclude = [
	'/api/v1/services/*/keys',
	'/api/v1/auth/login',
	'/api/v1/auth/sign-up',
	'',
];

export const csrf: RequestHandler = (req, res, next) => {
	// Skip CSRF when running tests (check process.env directly since it's set by jest)
	if (process.env.NODE_ENV === 'test') return next();

	// If the request path matches any exclude pattern, skip CSRF
	if (exclude.some((path) => isMatch(req.path, path))) return next();

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
