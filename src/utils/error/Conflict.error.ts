import GenericError from "./Generic.error";

class ConflictError extends GenericError{
	constructor(message: string) {
		super(message, 409);
	}
}

export default ConflictError;