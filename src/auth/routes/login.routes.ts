import { validate } from '@/middleware/validate.middleware';
import express from 'express';
import loginBodySchema from '../dto/login.dto';
import { loginController } from '../controllers/login.controller';

// /auth/*
const loginRouter = express.Router();

loginRouter.post('/login', validate(loginBodySchema), loginController);

export { loginRouter };
