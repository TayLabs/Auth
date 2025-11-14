import express from 'express';
import { authRouter } from './auth/routes/auth.routes';

const app = express();

app.use(express.json());

app.use(authRouter);

export default app;
