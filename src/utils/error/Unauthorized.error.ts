import GenericError from "./Generic.error";

class UnauthorizedError extends GenericError {
	constructor(message: string) {
		super(message, 401);
	}
}

export default UnauthorizedError;