import authenticate from '@/middleware/authenticate.middleware';
import { validateParams } from '@/middleware/validate.middleware';
import { Router } from 'express';
import { deleteAccountParamsSchema } from '../dto/deleteAccount.dto';
import { deleteAccount } from '../controllers/delete.controllers';

// /account/delete/*
const deleteAccountRouter = Router();

deleteAccountRouter.delete(
  '/:userId',
  validateParams(deleteAccountParamsSchema),
  authenticate({ allow: ['user.write'] }),
  deleteAccount
);

export { deleteAccountRouter };
