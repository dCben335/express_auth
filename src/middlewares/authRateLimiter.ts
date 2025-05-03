import rateLimit from 'express-rate-limit';
import env from '../utils/validations/env';

const authRateLimiter = rateLimit({
	windowMs: env.AUTH_RATE_LIMIT_WINDOW,
	max: env.AUTH_RATE_LIMIT_MAX,
	message: "Too many attempts, please try again later.",
});

export default authRateLimiter;