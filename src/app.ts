import express from 'express';
import { authRoutes } from './auth/routes/index.router';

const app = express();

app.use(express.json());

app.use(authRoutes);

export default app;
