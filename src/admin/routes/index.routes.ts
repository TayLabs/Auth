import express from 'express';
import { roleRouter } from './role.routes';
import { serviceRouter } from './service.routes';
import { userRouter } from './user.routes';

const adminRoutes = express.Router({ mergeParams: true });

adminRoutes.use('/users', userRouter);
adminRoutes.use('/services', serviceRouter);
adminRoutes.use('/roles', roleRouter);

export { adminRoutes };
