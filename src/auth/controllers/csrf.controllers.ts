import { controller } from '@/middleware/controller.middleware';
import { GetCSRFResBody } from '../dto/csrf/get.dto';
import HttpStatus from '@/types/HttpStatus.enum';

export const getCsrf = controller<undefined, GetCSRFResBody>(
	async (req, res, _next) => {
		const token = req.csrfToken();

		res.status(HttpStatus.OK).json({
			success: true,
			data: {
				csrfToken: token,
			},
		});
	}
);
