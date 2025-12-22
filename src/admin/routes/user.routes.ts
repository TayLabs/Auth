import authenticate from '@/middleware/authenticate.middleware';
import { Router } from 'express';
import {
	forcePasswordReset,
	getAll,
	updateRoles,
} from '../controllers/user.controllers';

const userRouter = Router({ mergeParams: true });

userRouter.get('/', authenticate({ allow: ['user.read.all'] }), getAll);
userRouter.patch(
	'/:userId/force-password-reset',
	authenticate({ allow: ['user.write.all'] }),
	forcePasswordReset
);
userRouter.patch(
	'/:userId/roles',
	authenticate({ allow: ['user.write.all'] }),
	updateRoles
);

export { userRouter };
