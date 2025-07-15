import GenericError from "./Generic.error";

class NotFoundError extends GenericError {
  constructor(message: string) {
    super(message, 404);
  }
}

export default NotFoundError;
