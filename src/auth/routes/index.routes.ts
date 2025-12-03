import express from 'express';
import { loginRouter } from './login.routes';
import { twoFactorRouter } from './twoFactor.routes';
import { resetPasswordRouter } from './resetPassword.routes';
import { verifyEmailRouter } from './verifyEmail.routes';

const authRoutes = express.Router();

authRoutes.use('/auth', loginRouter);
authRoutes.use('/auth/totp', twoFactorRouter);
authRoutes.use('/auth/password-reset', resetPasswordRouter);
authRoutes.use('/auth/verify-email', verifyEmailRouter);

export { authRoutes };
