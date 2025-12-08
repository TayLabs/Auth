import authenticate from '@/middleware/authenticate.middleware';
import { Router } from 'express';
import { add } from '../controllers/role.controllers';
import { validateBody } from '@/middleware/validate.middleware';
import { addRoleBodySchema } from '../dto/roles/add.dto';

const roleRouter = Router();

roleRouter.post(
	'/',
	authenticate({ allow: ['role.write'] }),
	validateBody(addRoleBodySchema),
	add
);

export { roleRouter };
