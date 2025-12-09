import authenticate from '@/middleware/authenticate.middleware';
import { Router } from 'express';
import { deleteAccount } from '../controllers/delete.controllers';

// /account/delete/*
const deleteAccountRouter = Router({ mergeParams: true });

deleteAccountRouter.delete(
  '/',
  authenticate({ allow: ['user.write'] }),
  deleteAccount
);

export { deleteAccountRouter };
