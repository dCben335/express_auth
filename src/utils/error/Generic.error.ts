export type ErrorsField = Record<string, (string[] | undefined)>;

class GenericError extends Error {
	statusCode: number;
	errors?: ErrorsField;

	constructor(message: string, statusCode: number, errors?: ErrorsField) {
		super(message);
		this.statusCode = statusCode;
	  	this.name = this.constructor.name;
		this.errors = errors;
  
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, this.constructor);
		}
	}
}

export default GenericError;
