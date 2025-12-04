import { controller } from '@/middleware/controller.middleware';
import type {
  ToggleTwoFactorParams,
  ToggleTwoFactorResBody,
} from '../dto/toggleTwoFactor.dto';
import User from '@/services/User.service';
import HttpStatus from '@/types/HttpStatus.enum';
import { db } from '@/config/db';
import { totpTokenTable } from '@/config/db/schema/totpToken.schema';
import { eq, and } from 'drizzle-orm';
import AppError from '@/types/AppError';

export const toggleTwoFactor = controller<
  undefined,
  ToggleTwoFactorResBody,
  ToggleTwoFactorParams
>(async (req, res, _next) => {
  const isEnabled = req.params.switch === 'on'; // else 'off' -> false

  const totpTokens = await db
    .select({
      id: totpTokenTable.id,
    })
    .from(totpTokenTable)
    .where(
      and(
        eq(totpTokenTable.userId, req.user.id),
        eq(totpTokenTable.isVerified, true)
      )
    );

  if (totpTokens.length === 0 && isEnabled) {
    throw new AppError(
      'Please add a 2FA method before enabling',
      HttpStatus.BAD_REQUEST
    );
  }
  await new User(req.user.id).update({
    twoFactorEnabled: isEnabled,
  });

  res.status(HttpStatus.OK).json({
    success: true,
    data: {},
  });
});
