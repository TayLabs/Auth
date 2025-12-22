import express from 'express';
import { totpRouter } from './totp.routes';
import { securityRouter } from './security.routes';
import { profileRouter } from './profile.routes';
import { deleteAccountRouter } from './deleteAccount.routes';

const accountRoutes = express.Router({ mergeParams: true });

accountRoutes.use('/security', securityRouter);
accountRoutes.use('/security/totp', totpRouter);
accountRoutes.use('/profile', profileRouter);
accountRoutes.use('/delete', deleteAccountRouter);

export { accountRoutes };
