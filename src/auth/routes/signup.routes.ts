import { validate } from '@/middleware/validate.middleware';
import express from 'express';
import signupBodySchema from '../dto/signup.dto';
import { signupController } from '../controllers/signup.controller';

// /auth/*
const signupRouter = express.Router();

signupRouter.post('/signup', validate(signupBodySchema), signupController);

export { signupRouter };
