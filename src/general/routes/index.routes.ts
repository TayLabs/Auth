import { Router } from 'express';
import { healthRoutes } from './health.routes';

const generalRoutes = Router();

generalRoutes.use('/ok', healthRoutes);

export { generalRoutes };
