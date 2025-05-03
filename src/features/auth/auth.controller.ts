import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { findUserByEmail, createUser } from '../user/user.repository';
import { findAndRevokeToken, handleTokens } from './auth.service';

export const register = async (
	req: Request, 
	res: Response, 
	next: NextFunction
): Promise<any> => {
  	try {
		const { email, password } = req.body;
		const existingUser = await findUserByEmail(email);
		if (existingUser) {
			return res.status(409).json({ message: 'Email already in use.' });
		}
		const user = await createUser({ email, password });
		const { accessToken, refreshToken } = await handleTokens(user.id, req);
		return res.status(201).json({ accessToken, refreshToken });
	} catch (err) {
		return next(err);
  	}
};

export const login = async(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<any> => {
	try {
		const { email, password } = req.body;

		const user = await findUserByEmail(email);
		if (!user) {
			return res.status(401).json({ message: 'Invalid credentials' });
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(401).json({ message: 'Invalid credentials' });
		}
		const { accessToken, refreshToken } = await handleTokens(user.id, req);
		return res.status(200).json({ accessToken, refreshToken });
	} catch (err) {
		return next(err);
	}
};

export const refreshToken = async(
	req: Request, 
	res: Response, 
	next: NextFunction
): Promise<any> => {
	try {
		const token = await findAndRevokeToken(req.body.refreshToken);
		if (!token) {
			return res.status(401).json({ message: 'Invalid or expired refresh token' });
		}
		const { accessToken, refreshToken } = await handleTokens(token.userId, req);
		return res.status(200).json({ accessToken, refreshToken });
	} catch (err) {
		return next(err);
	}
};

export const logout = async(
	req: Request, 
	res: Response, 
	next: NextFunction
): Promise<any> => {
	try {
		const { refreshToken } = req.body;
		const storedToken = await findAndRevokeToken(refreshToken);
		if (!storedToken) {
			return res.status(401).json({ message: 'Invalid refresh token' });
		}
		return res.status(200).json({ message: 'Logged out successfully' });
	} catch (err) {
		return next(err);
	}
};
