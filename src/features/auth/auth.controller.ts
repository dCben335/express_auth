import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { findUserByEmail, createUser } from '../user/user.repository';
import { findAndRevokeToken, handleTokens } from './auth.service';
import ConflictError from '../../utils/error/Conflict.error';
import UnauthorizedError from '../../utils/error/Unauthorized.error';

export const register = async (
	req: Request, 
	res: Response, 
	next: NextFunction
): Promise<any> => {
  	try {
		const { email, password } = req.body;
		const existingUser = await findUserByEmail(email);
		if (existingUser) {
			throw new ConflictError('This email is already registered');
		}
		const user = await createUser({ email, password });
		const { accessToken, refreshToken } = await handleTokens(user.id, req);
		return res.success(201, { accessToken, refreshToken }, 'User created successfully');
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
			throw new UnauthorizedError('Invalid credentials');
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			throw new UnauthorizedError('Invalid credentials');
		}
		const { accessToken, refreshToken } = await handleTokens(user.id, req);
		return res.success(200, { 
			accessToken, 
			refreshToken 
		}, 'Login successful');
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
			throw new UnauthorizedError('Invalid refresh token');
		}
		const { accessToken, refreshToken } = await handleTokens(token.userId, req);
		return res.success(200, { 
			accessToken,
			refreshToken 
		}, 'Token refreshed successfully');
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
			throw new UnauthorizedError('Invalid refresh token');
		}
		return res.success(200, {}, 'Logout successful');
	} catch (err) {
		return next(err);
	}
};
