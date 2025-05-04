import GenericError from "./Generic.error";

class ForbiddenError extends GenericError {
	constructor(message: string) {
		super(message, 403);
	}
}

export default ForbiddenError;