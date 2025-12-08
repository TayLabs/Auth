import express from 'express';
import { loginRouter } from './login.routes';
import { totpRouter } from './totp.routes';
import { resetPasswordRouter } from './resetPassword.routes';
import { verifyEmailRouter } from './verifyEmail.routes';
import logoutRouter from './logout.routes';

const authRoutes = express.Router({ mergeParams: true });

authRoutes.use('/auth', loginRouter);
authRoutes.use('/auth/totp', totpRouter);
authRoutes.use('/auth/password', resetPasswordRouter);
authRoutes.use('/auth/email', verifyEmailRouter);
authRoutes.use('/auth/logout', logoutRouter);

export { authRoutes };
