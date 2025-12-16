import { Router } from 'express';
import { getCsrf } from '../controllers/csrf.controllers';

// /auth/csrf
const csrfRouter = Router();

csrfRouter.get('/', getCsrf);

export { csrfRouter };
