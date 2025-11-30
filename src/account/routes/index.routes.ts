import express from 'express';
import { twoFactorRouter } from './totp.routes';

const accountRoutes = express.Router();

accountRoutes.use('/account/totp', twoFactorRouter);

export { accountRoutes };
