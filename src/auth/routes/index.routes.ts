import express from 'express';
import { loginRouter } from './login.routes';
import { signupRouter } from './signup.routes';

const authRoutes = express.Router();

authRoutes.use('/auth', loginRouter);
authRoutes.use('/auth', signupRouter);

export { authRoutes };
