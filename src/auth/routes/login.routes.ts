import { validate } from '@/middleware/validate.middleware';
import express from 'express';
import loginBodySchema from '../dto/login.dto';

// /auth/*
const loginRouter = express.Router();

loginRouter.post('/login', validate(loginBodySchema), () => {});

export { loginRouter };
