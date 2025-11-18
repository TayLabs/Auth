import env from '@/types/env';
import session from 'express-session';

const expressSession = session({
	secret: env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false,
	cookie: {
		secure: env.NODE_ENV === 'production', // Use secure cookies in production
		httpOnly: true,
		maxAge: 1000 * 60 * 60 * 24 * 30, // 30 day
	},
});

export default expressSession;
