import { Router } from 'express';
import { z } from 'zod';
import { userEmailSchema, userPasswordSchema } from '../user/user.schema';
import { login, logout, refreshToken, register } from './auth.controller';
import validateBody from '../../middlewares/validateBody';
import verifyAccessToken from '../../middlewares/verifyAccessToken';

const router = Router();

const registerSchema = z.object({
	email: userEmailSchema,
	password: userPasswordSchema,
});

const loginSchema = z.object({
	email: userEmailSchema,
	password: userPasswordSchema
});

const refreshTokenSchema = z.object({
	refreshToken: z.string(),
});

const logoutSchema = z.object({
	refreshToken: z.string(),
});

router.post('/register', validateBody(registerSchema), register);
router.post('/login', validateBody(loginSchema), login);
router.post('/refresh-token', validateBody(refreshTokenSchema), refreshToken);
router.post('/logout', verifyAccessToken, validateBody(logoutSchema), logout);

export default router;