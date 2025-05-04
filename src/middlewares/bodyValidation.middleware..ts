import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ZodSchema } from 'zod';
import sanitizeHtml from 'sanitize-html';
import ValidationError from '../utils/error/Validation.error';

const isObject = (value: unknown): value is Record<string, unknown> => {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
};

const sanitizeInput = (obj: Record<string, unknown>) => {
	return Object.entries(obj).reduce<Record<string, unknown>>((acc, [key, value]) => {
		if (typeof value === 'string') {
			acc[key] = sanitizeHtml(value, {
				allowedTags: [],
				allowedAttributes: {},
			});
		} else if (isObject(value)) {;
			acc[key] = sanitizeInput(value);
		} else 
			acc[key] = value;
		return acc;
	}, {});
};

const bodyValidationMiddleware = (schema: ZodSchema): RequestHandler => {
	return (req: Request, res: Response, next: NextFunction) => {
		const sanitizedBody = sanitizeInput(req.body);
		const result = schema.safeParse(sanitizedBody);

		if (!result.success) {
			throw new ValidationError('Validation error', result.error.flatten().fieldErrors)
		}

		req.body = result.data;
		next();
	};
};

export default bodyValidationMiddleware;
