import express from 'express';
import { totpRouter } from './totp.routes';
import { securityRouter } from './security.routes';
import { profileRouter } from './profile.routes';

const accountRoutes = express.Router();

accountRoutes.use('/account/security', securityRouter);
accountRoutes.use('/account/security/totp', totpRouter);
accountRoutes.use('/account/profile', profileRouter);

export { accountRoutes };
