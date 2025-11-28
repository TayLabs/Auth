import express from 'express';
import { loginRouter } from './login.routes';
import { twoFactorRouter } from './twoFactor.routes';

const authRoutes = express.Router();

authRoutes.use('/auth', loginRouter);
authRoutes.use('/auth', twoFactorRouter);

export { authRoutes };
