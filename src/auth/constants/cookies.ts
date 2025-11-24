import type { CookieOptions } from 'express';

export const deviceCookie = {
	name: '_d_identifier',
	options: { httpOnly: false } as CookieOptions,
} as const;
export const selectedSessionCookie = {
	name: '_selected_s',
	options: { httpOnly: false } as CookieOptions,
} as const;
export const sessionCookie = {
	name: (sessionId: string) => `_s_${sessionId}`,
	options: { httpOnly: true } as CookieOptions,
} as const;
export const accessTokenCookie = {
	name: '_access_t',
	options: { httpOnly: false } as CookieOptions,
} as const;
