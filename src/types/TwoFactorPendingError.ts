import HttpStatus from './HttpStatus.enum';

export default class TwoFactorPendingError extends Error {
	public statusCode: number;

	constructor(
		message: string,
		statusCode: (typeof HttpStatus)[keyof typeof HttpStatus]
	) {
		super(message);
		this.statusCode = statusCode;
		Object.setPrototypeOf(this, TwoFactorPendingError.prototype); // Prevent any bugs with extending built-in classes
	}
}
