import { validate } from '@/middleware/validate.middleware';
import express from 'express';
import loginBodySchema from '../dto/login.dto';
import { signupController } from '../controllers/signup.controller';

// /auth/*
const signupRouter = express.Router();

signupRouter.post('/signup', validate(loginBodySchema), signupController);

export { signupRouter };
