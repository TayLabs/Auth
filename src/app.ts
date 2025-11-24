import express from 'express';
import { authRoutes } from './auth/routes/index.routes';
import helmet from 'helmet';
import { errorHandler } from './middleware/error.middleware';
import { notFoundHandler } from './middleware/notFound.middleware';
import bodyParser from 'body-parser';
import { express as useragent } from 'express-useragent';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

// CORS
app.use(
	cors({
		origin: true,
		credentials: true,
	})
);

// Parse application/x-www-form-urlencoded and application/json requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Parse cookies into more usable format
app.use(cookieParser());

// Security middleware
app.use(helmet());
app.disable('x-powered-by'); // Disable the 'X-Powered-By' header for security (normally includes framework being used)

// Useragent detection middleware
app.use(useragent());

// Register routes (anything exported from /*/routes/*.router.ts)
app.use('/api/v1', authRoutes);

// Handle 404 - Not Found
app.use(notFoundHandler);

// Global error handler (must be last - catches errors from routes)
app.use(errorHandler);

export default app;
