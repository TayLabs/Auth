import express from 'express';
import { validateBody } from '@/middleware/validate.middleware';
import loginBodySchema from '../dto/login.dto';
import signupBodySchema from '../dto/signup.dto';
import refreshBodySchema from '../dto/refresh.dto';
import {
	loginController,
	refreshController,
	signupController,
} from '../controllers/login.controllers';

// /auth/*
const loginRouter = express.Router();

loginRouter.post('/login', validateBody(loginBodySchema), loginController);
loginRouter.post('/signup', validateBody(signupBodySchema), signupController);
loginRouter.post(
	'/refresh',
	validateBody(refreshBodySchema),
	refreshController
);

export { loginRouter };
