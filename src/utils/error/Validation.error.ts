import GenericError, { ErrorsField } from "./Generic.error";

class ValidationError extends GenericError {
	constructor(message: string, errors: ErrorsField) {
		super(message, 400, errors);
	}
}

export default ValidationError;