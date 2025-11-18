import type { SignupReqBody, SignupResBody } from '../dto/signup.dto';
import { controller } from '@/middleware/controller.middleware';
import HttpStatus from '@/types/HttpStatus.enum';

export const signupController = controller<SignupReqBody, SignupResBody>(
	(req, res, next) => {
		// Signup logic here

		res.status(HttpStatus.CREATED).json({
			success: true,
			data: {
				userId: '00000000-0000-0000-0000-000000000000',
				email: req.body.email,
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				userName: `${req.body.firstName.toLowerCase()}.${req.body.lastName.toLowerCase()}`,
			},
		});
	}
);
