import HttpStatus from './HttpStatus.enum';

export default class PasswordResetPendingError extends Error {
	public statusCode: number;

	constructor(
		message: string,
		statusCode: (typeof HttpStatus)[keyof typeof HttpStatus]
	) {
		super(message);
		this.statusCode = statusCode;
		Object.setPrototypeOf(this, PasswordResetPendingError.prototype); // Prevent any bugs with extending built-in classes
	}
}
