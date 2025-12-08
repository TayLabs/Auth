import express from 'express';
import {
	validateBody,
	validateQueryParams,
} from '@/middleware/validate.middleware';
import { verifyEmailQueryParamsSchema } from '../dto/verifyEmail.dto';
import { sendVerify, verify } from '../controllers/verifyEmail.controllers';
import { sendVerifyEmailBodySchema } from '../dto/sendVerifyEmail.dto';
import authenticate from '@/middleware/authenticate.middleware';

// /auth/verify-email/*
const verifyEmailRouter = express.Router();

verifyEmailRouter.post(
	'/send',
	authenticate({ acceptPending: 'emailVerification' }),
	validateBody(sendVerifyEmailBodySchema),
	sendVerify
);
verifyEmailRouter.post(
	'/',
	validateQueryParams(verifyEmailQueryParamsSchema),
	verify
);

export { verifyEmailRouter };
