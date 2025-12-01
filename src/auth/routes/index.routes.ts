import express from 'express';
import { loginRouter } from './login.routes';
import { twoFactorRouter } from './twoFactor.routes';
import { resetPasswordRouter } from './resetPassword.routes';

const authRoutes = express.Router();

authRoutes.use('/auth', loginRouter);
authRoutes.use('/auth/totp', twoFactorRouter);
authRoutes.use('/auth/password-reset', resetPasswordRouter);

export { authRoutes };
