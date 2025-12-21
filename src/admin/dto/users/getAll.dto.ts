import type { ResponseBody } from '@/types/ResponseBody';
import type { User } from '@/interfaces/user.interface';

type GetAllUsersResBody = ResponseBody<{
	users: Omit<User, 'passwordHash'>[];
}>;

export { type GetAllUsersResBody };
