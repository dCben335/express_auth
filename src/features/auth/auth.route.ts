import { Router } from "express";
import { z } from "zod";
import { userEmailSchema, userPasswordSchema } from "../user/user.schema";
import { login, logout, refreshToken, register } from "./auth.controller";
import bodyValidationMiddleware from "../../middlewares/bodyValidation.middleware.";
import accessMiddleware from "../../middlewares/access.middleware";

const router = Router();

const registerSchema = z.object({
  email: userEmailSchema,
  password: userPasswordSchema,
});

const loginSchema = z.object({
  email: userEmailSchema,
  password: userPasswordSchema,
});

const refreshTokenSchema = z.object({
  refreshToken: z.string(),
});

const logoutSchema = z.object({
  refreshToken: z.string(),
});

router.post("/register", bodyValidationMiddleware(registerSchema), register);
router.post("/login", bodyValidationMiddleware(loginSchema), login);
router.post(
  "/refresh-token",
  bodyValidationMiddleware(refreshTokenSchema),
  refreshToken,
);
router.post(
  "/logout",
  accessMiddleware,
  bodyValidationMiddleware(logoutSchema),
  logout,
);

export default router;
