import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import env from '../config/env';

declare module 'express' {
    interface Request {
        userId?: string;
    }
}

const verifyAccessToken = (req: Request, res: Response, next: NextFunction) => {
	const token = req.headers['authorization']?.split(' ')[1];

	if (!token) {
		res.status(403).json({ message: 'Access token is required' });
		return;
	}

	jwt.verify(token, env.JWT_ACCESS_SECRET, (err, decoded) => {
		if (err || !decoded) {
			res.status(401).json({ message: 'Invalid or expired access token' });
			return;
		}
		const decodedToken = decoded as JwtPayload;
		req.userId = decodedToken.userId;
		next();
  	});
}

export default verifyAccessToken;
