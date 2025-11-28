import express from 'express';
import { validate } from '@/middleware/validate.middleware';
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

loginRouter.post('/login', validate(loginBodySchema), loginController);
loginRouter.post('/signup', validate(signupBodySchema), signupController);
loginRouter.post('/refresh', validate(refreshBodySchema), refreshController);

export { loginRouter };
