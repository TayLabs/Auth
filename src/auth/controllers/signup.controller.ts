import type { SignupReqBody, SignupResBody } from '../dto/signup.dto';
import { controller } from '@/middleware/controller.middleware';
import HttpStatus from '@/types/HttpStatus.enum';
import User from '../utils/User.util';

export const signupController = controller<SignupReqBody, SignupResBody>(
	async (req, res, next) => {
		const user = await User.createAsync(req.body.email, req.body.password, {
			firstName: req.body.firstName,
			lastName: req.body.lastName,
		});

		res.status(HttpStatus.CREATED).json({
			success: true,
			data: {
				userId: user.id,
				email: user.email,
				firstName: user.profile.firstName,
				lastName: user.profile.lastName,
				username: user.profile.username,
			},
		});
	}
);
