import express from 'express';
import { authRoutes } from './auth/routes/index.router';
import helmet from 'helmet';
import { errorHandler } from './middleware/error.middleware';
import { notFoundHandler } from './middleware/notFound.middleware';
import bodyParser from 'body-parser';

const app = express();

// Parse application/x-www-form-urlencoded and application/json requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Security middleware
app.use(helmet());
app.disable('x-powered-by'); // Disable the 'X-Powered-By' header for security (normally includes framework being used)

// Global error handler (async functions call next(err))
app.use(errorHandler);

// Register routes (anything exported from /*/routes/*.router.ts)
app.use(authRoutes);

// Handle 404 - Not Found
app.use(notFoundHandler);

export default app;
