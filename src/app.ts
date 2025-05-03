import express, { Request, Response } from 'express';
import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.routes';
import env from './utils/validations/env';
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