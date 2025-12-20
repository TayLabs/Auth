import AppError from '@/types/AppError';
import env from '@/types/env';
import HttpStatus from '@/types/HttpStatus.enum';
import axios from 'axios';

type SendMailPayload = {
	to: {
		name?: string;
		email: string;
	};
	subject: string;
	text: string;
	html: string;
};

export const sendMail = async (data: SendMailPayload) => {
	try {
		const response = await axios.post(
			`http://${env.MAIL_API.HOST}:${env.MAIL_API.PORT}/api/v1/send`,
			{
				...data,
			},
			{
				headers: {
					'Content-Type': 'application/json',
					'x-api-key': env.MAIL_API_KEY,
				},
			}
		);

		if (!response.data.success) {
			throw new AppError(
				'Mail returned unsuccessful response',
				HttpStatus.INTERNAL_SERVER_ERROR
			);
		}
	} catch (error) {
		if (axios.isAxiosError(error)) {
			if (env.NODE_ENV === 'development')
				console.error('Mail API Error:', {
					code: error.code,
					message: error.message,
					data: error.response?.data,
				});

			throw new AppError(
				error.message,
				(error.status as (typeof HttpStatus)[keyof typeof HttpStatus]) ||
					HttpStatus.INTERNAL_SERVER_ERROR
			);
		} else {
			throw new AppError(
				'Internal server error',
				HttpStatus.INTERNAL_SERVER_ERROR
			);
		}
	}
};
