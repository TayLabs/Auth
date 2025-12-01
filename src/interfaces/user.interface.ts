import type { UUID } from 'node:crypto';
import type { Profile } from './profile.interface';

export type User = {
  id: UUID;
  email: string;
  emailVerified: boolean;
  passwordHash?: string;
  forcePasswordChange: boolean;
  phoneNumber: string | null;
  phoneTwoFactorEnabled: boolean;
  twoFactorEnabled: boolean;
  createdAt: Date;
  profile: Profile;
};
