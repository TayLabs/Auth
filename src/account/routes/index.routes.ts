import express from 'express';
import { totpRouter } from './totp.routes';
import { securityRouter } from './security.routes';

const accountRoutes = express.Router();

accountRoutes.use('/account/security', securityRouter);
accountRoutes.use('/account/security/totp', totpRouter);

export { accountRoutes };
