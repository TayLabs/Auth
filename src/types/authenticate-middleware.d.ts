import type { UUID } from 'node:crypto';

declare global {
	namespace Express {
		interface Request {
			/** Parsed user-agent details added by `express-useragent` middleware */
			user: {
				id: UUID;
			};
		}
	}
}

export {};
