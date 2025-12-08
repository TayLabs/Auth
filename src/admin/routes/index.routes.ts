import express from 'express';
import { roleRouter } from './role.routes';

const adminRoutes = express.Router();

adminRoutes.use('/admin/roles', roleRouter);

export { adminRoutes };
