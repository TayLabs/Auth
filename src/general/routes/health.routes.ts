import { Router } from 'express';
import { check } from '../controllers/health.controller';

const healthRoutes = Router();

healthRoutes.get('/', check);

export { healthRoutes };
