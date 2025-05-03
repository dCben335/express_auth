import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { storeRefreshToken, findRefreshToken, revokeRefreshTokenById } from '../services/auth.services';
import { findUserByEmail, createUserByEmailAndPassword } from '../services/user.services';
import { generateTokens } from '../utils/jwt';

const createAndStoreRefreshToken = async (userId: string, userAgent: string, ipAddress: string) => {
	const tokens = generateTokens(userId);
	await storeRefreshToken({
		refreshToken: tokens.refreshToken,
		userId,
		userAgent,
		ipAddress,
	});
	return tokens;
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  	try {
		const { email, password } = req.body;

		const existingUser = await findUserByEmail(email);
		if (existingUser) {
			res.status(409).json({ message: 'Email already in use.' });
			return;
		}

		const user = await createUserByEmailAndPassword({ email, password });
		if (!user) {
			res.status(500).json({ message: 'Failed to create user.' });
			return;
		}

		const { accessToken, refreshToken } = await createAndStoreRefreshToken(
			user.id,
			req.headers['user-agent'] || '',
			req.ip || ''
		);

		res.status(201).json({ accessToken, refreshToken });
	} catch (err) {
		next(err);
  	}
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { email, password } = req.body;

		const user = await findUserByEmail(email);
		if (!user) {
			res.status(401).json({ message: 'Invalid credentials' });
			return;
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			res.status(401).json({ message: 'Invalid credentials' });
			return;
		}

		const { accessToken, refreshToken } = await createAndStoreRefreshToken(
			user.id,
			req.headers['user-agent'] || '',
			req.ip || ''
		);

		res.status(200).json({ accessToken, refreshToken });
	} catch (err) {
		next(err);
	}
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const storedToken = await findRefreshToken(req.body.refreshToken);
		if (!storedToken || storedToken.revoked || storedToken.expireAt < new Date()) {
			res.status(401).json({ message: 'Invalid or expired refresh token' });
			return;
		}
		await revokeRefreshTokenById(storedToken.id);
		const { accessToken, refreshToken } = await createAndStoreRefreshToken(
			storedToken.userId,
			req.headers['user-agent'] || '',
			req.ip || ''
		);
		res.status(200).json({ accessToken, refreshToken });
	} catch (err) {
		next(err);
	}
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { refreshToken } = req.body;
		const storedToken = await findRefreshToken(refreshToken);
		if (!storedToken) {
			res.status(401).json({ message: 'Invalid refresh token' });
			return;
		}
		await revokeRefreshTokenById(storedToken.id);
		res.status(200).json({ message: 'Logged out successfully' });
	} catch (err) {
		next(err);
	}
};
