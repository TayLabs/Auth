import express from 'express';
import { roleRouter } from './role.routes';
import { serviceRouter } from './service.routes';

const adminRoutes = express.Router({ mergeParams: true });

adminRoutes.use('/admin/services', serviceRouter);
adminRoutes.use('/admin/services/:serviceId/roles', roleRouter);

export { adminRoutes };
