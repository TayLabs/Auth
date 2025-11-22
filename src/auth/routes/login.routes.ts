import { validate } from '@/middleware/validate.middleware';
import express from 'express';
import loginBodySchema from '../dto/login.dto';
import signupBodySchema from '../dto/signup.dto';
import {
	loginController,
	signupController,
} from '../controllers/login.controller';

// /auth/*
const loginRouter = express.Router();

loginRouter.post('/login', validate(loginBodySchema), loginController);
loginRouter.post('/signup', validate(signupBodySchema), signupController);

export { loginRouter };
