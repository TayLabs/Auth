import { User } from '@/interfaces/user.interface';
import { type ResponseBody } from '@/types/ResponseBody';

type GetProfileResBody = ResponseBody<{
  profile: Omit<User, 'passwordHash'>;
}>;

export { type GetProfileResBody };
