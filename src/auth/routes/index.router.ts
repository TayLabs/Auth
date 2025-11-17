import express from 'express';
import { loginRouter } from './login.routes';

const authRoutes = express.Router();

authRoutes.use('/auth', loginRouter);

export { authRoutes };
