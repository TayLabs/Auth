import express from 'express';
import { totpRouter } from './totp.routes';
import { securityRouter } from './security.routes';
import { profileRouter } from './profile.routes';
import { deleteAccountRouter } from './deleteAccount.routes';

const accountRoutes = express.Router({ mergeParams: true });

accountRoutes.use('/account/security', securityRouter);
accountRoutes.use('/account/security/totp', totpRouter);
accountRoutes.use('/account/profile', profileRouter);
accountRoutes.use('/account/delete', deleteAccountRouter);

export { accountRoutes };
