import { Request, Response, NextFunction } from 'express';
import env from '../config/env';

const enforceHttps = (req: Request, res: Response, next: NextFunction) => {
	if (env.APP_ENV === 'production' && req.headers['x-forwarded-proto'] !== 'https') {
		return res.redirect('https://' + req.headers.host + req.url);
	}
	next();
};

export default enforceHttps;