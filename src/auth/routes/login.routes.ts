import express from 'express';
import { validate } from '@/middleware/validate.middleware';
import loginBodySchema from '../dto/login.dto';
import signupBodySchema from '../dto/signup.dto';
import refreshBodySchema from '../dto/refresh.dto';
import totpCreateBodySchema from '../dto/totpCreate.dto';
import {
	loginController,
	totpCreateController,
	refreshController,
	signupController,
} from '../controllers/login.controller';
import authenticate from '@/middleware/authenticate.middleware';

// /auth/*
const loginRouter = express.Router();

loginRouter.post('/login', validate(loginBodySchema), loginController);
loginRouter.post(
	'/totp/add',
	authenticate(),
	validate(totpCreateBodySchema),
	totpCreateController
);
loginRouter.post('/signup', validate(signupBodySchema), signupController);
loginRouter.post('/refresh', validate(refreshBodySchema), refreshController);

export { loginRouter };
