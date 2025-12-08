import { controller } from '@/middleware/controller.middleware';
import {
  DeleteAccountReqParams,
  DeleteAccountResBody,
} from '../dto/deleteAccount.dto';

export const deleteAccount = controller<
  {},
  DeleteAccountResBody,
  DeleteAccountReqParams
>(async (req, res, _next) => {
  // Delete User logic
});
