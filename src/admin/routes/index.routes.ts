import express from 'express';
import { roleRouter } from './role.routes';
import { serviceRouter } from './service.routes';
import { userRouter } from './user.routes';

const adminRoutes = express.Router({ mergeParams: true });

adminRoutes.use('/admin/users', userRouter);
adminRoutes.use('/admin/services', serviceRouter);
adminRoutes.use('/admin/roles', roleRouter);

export { adminRoutes };
