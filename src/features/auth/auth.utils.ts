import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User } from '../../prisma/generated';
import env from '../../config/env';

const BYTES_LENGTH = 16;
const ENCODING = 'base64url';

const generateAccessToken = (userId: User['id']) => {
	return jwt.sign({ userId }, env.JWT_ACCESS_SECRET, {
		expiresIn: env.JWT_ACCESS_EXPIRE_IN_SECOND,
	});
}

const generateRefreshToken = () => {
	return crypto
		.randomBytes(BYTES_LENGTH)
		.toString(ENCODING)
}

export const generateTokens = (userId: User['id']) =>{
	return { 
		accessToken: generateAccessToken(userId),
		refreshToken : generateRefreshToken(),
	};
}

