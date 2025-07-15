import express, { NextFunction, Request, Response } from "express";
import userRoutes from "./features/user/user.route";
import authRoutes from "./features/auth/auth.route";
import env from "./config/env";
import httpsMiddleware from "./middlewares/https.middleware";
import rateLimiterMiddleware from "./middlewares/rateLimiter.middleware";
import errorMiddleware from "./middlewares/res/error.middleware";
import successMiddleware from "./middlewares/res/success.middleware";
import accessMiddleware from "./middlewares/access.middleware";

const app = express();

if (env.APP_ENV === "production") {
  app.set("trust proxy", 1);
}

app.use(successMiddleware);
app.use(httpsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", userRoutes);
app.use("/auth", rateLimiterMiddleware, authRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome",
  });
});

app.get("/protected", accessMiddleware, (req: Request, res: Response) => {
  res.success(200, undefined, "Protected route accessed successfully");
});

app.use(errorMiddleware);

export default app;
