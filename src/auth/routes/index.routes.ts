import express from 'express';
import { loginRouter } from './login.routes';
import { totpRouter } from './totp.routes';
import { resetPasswordRouter } from './resetPassword.routes';
import { verifyEmailRouter } from './verifyEmail.routes';
import logoutRouter from './logout.routes';
import { csrfRouter } from './csrf.routes';

const authRoutes = express.Router({ mergeParams: true });

authRoutes.use('/', loginRouter);
authRoutes.use('/csrf', csrfRouter);
authRoutes.use('/totp', totpRouter);
authRoutes.use('/password', resetPasswordRouter);
authRoutes.use('/email', verifyEmailRouter);
authRoutes.use('/logout', logoutRouter);

export { authRoutes };
