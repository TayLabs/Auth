import express from 'express';
import { roleRouter } from './role.routes';
import { permissionRouter } from './permission.routes';
import { serviceRouter } from './service.routes';

const adminRoutes = express.Router();

adminRoutes.use('/admin/services', serviceRouter);
adminRoutes.use('/admin/roles', roleRouter);
adminRoutes.use('/admin/permissions', permissionRouter);

export { adminRoutes };
