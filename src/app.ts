import express, { Request, Response } from 'express';
import userRoutes from './features/user/user.route';
import authRoutes from './features/auth/auth.route';
import env from './config/env';
import enforceHttps from './middlewares/enforceHttps';
import verifyAccessToken from './middlewares/verifyAccessToken';
import authRateLimiter from './middlewares/authRateLimiter';

const app = express();

if (env.APP_ENV === 'production') {
	app.set('trust proxy', 1);
}

app.use(enforceHttps);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/users', userRoutes);
app.use('/auth', authRateLimiter, authRoutes);

app.get('/', (req, res) => {
	res.status(200).json({
		message: 'Welcome',
	});
});

app.get('/protected', verifyAccessToken, (req: Request, res: Response) => {
	res.status(200).json({
		message: 'Protected route',
		userId: req.userId,
	});
});


app.listen(env.APP_PORT, () => {
	console.log(`Server is running on ${env.APP_URL}:${env.APP_PORT}`);
});