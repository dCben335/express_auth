import rateLimit from "express-rate-limit";
import env from "../config/env";

const rateLimiterMiddleware = rateLimit({
  windowMs: env.AUTH_RATE_LIMIT_WINDOW_MS,
  max: env.AUTH_RATE_LIMIT_MAX,
  message: "Too many attempts, please try again later.",
});

export default rateLimiterMiddleware;
