import type { AgentDetails } from 'express-useragent';

declare global {
	namespace Express {
		interface Request {
			/** Parsed user-agent details added by `express-useragent` middleware */
			useragent?: AgentDetails;
		}
	}
}

export {};
