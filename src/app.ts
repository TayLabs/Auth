import express from 'express';
import { authRoutes } from './auth/routes/index.routes';
import helmet from 'helmet';
import { errorHandler } from './middleware/error.middleware';
import { notFoundHandler } from './middleware/notFound.middleware';
import bodyParser from 'body-parser';
import expressSession from './config/express-session';

const app = express();

// Parse application/x-www-form-urlencoded and application/json requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Security middleware
app.use(helmet());
app.disable('x-powered-by'); // Disable the 'X-Powered-By' header for security (normally includes framework being used)

// Session
app.use(expressSession);

// Global error handler (async functions call next(err))
app.use(errorHandler);

// Register routes (anything exported from /*/routes/*.router.ts)
app.use('/api/v1', authRoutes);

// Handle 404 - Not Found
app.use(notFoundHandler);

export default app;
