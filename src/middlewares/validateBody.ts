import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ZodSchema } from 'zod';
import sanitizeHtml from 'sanitize-html';

const isObject = (value: any): value is Record<string, unknown> => {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
};

const sanitizeInput = (obj: any): any => {
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

const validateBody = (schema: ZodSchema): RequestHandler => {
	return (req: Request, res: Response, next: NextFunction) => {
		const result = schema.safeParse(req.body);

		if (!result.success) {
			res.status(400).json({
				message: 'Validation error',
				errors: result.error.flatten().fieldErrors,
			});
			return;
		}

		req.body = result.data;
		next();
	};
};

export default validateBody;
