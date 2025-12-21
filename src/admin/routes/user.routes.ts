import authenticate from '@/middleware/authenticate.middleware';
import { Router } from 'express';
import { getAll } from '../controllers/user.controllers';

const userRouter = Router({ mergeParams: true });

userRouter.get('/', authenticate({ allow: ['user.read.all'] }), getAll);
userRouter.patch('/:userId', authenticate({ allow: ['user.write.all'] }));
userRouter.patch('/:userId/roles', authenticate({ allow: ['user.write.all'] }));

export { userRouter };
