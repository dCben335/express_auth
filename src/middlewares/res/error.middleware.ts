import { NextFunction, Request, Response } from "express";
import CustomError from "../../utils/error/Generic.error";
  
const INTERNAL_ERROR_MESSAGE = 'Internal Server Error';

const errorMiddleware = (
	err: CustomError | Error, 
	req: Request, 
	res: Response, 
	next: NextFunction
  ) => {
	if (err instanceof CustomError) {
		res.status(err.statusCode).json({
			success: false,
			error: err.errors,
			message: err.message,
		});
		return;
	} 
	res.status(500).json({
		success: false,
		message: INTERNAL_ERROR_MESSAGE,
	});
};

export default errorMiddleware;