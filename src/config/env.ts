import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const parseAsNumber = (val: string, ctx: z.RefinementCtx) => {
  const parsed = Number(val);
  if (isNaN(parsed)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Invalid number: ${val}`,
    });
    return z.NEVER;
  }
  return parsed;
};

export type Env = z.infer<typeof envSchema>;
const envSchema = z.object({
  APP_ENV: z.enum(["development", "production"]).default("development"),

  APP_HOST: z.string().default("localhost"),
  APP_URL: z.string().url().default("http://localhost"),
  APP_PORT: z.string().min(1).transform(parseAsNumber),

  AUTH_RATE_LIMIT_MAX: z.string().min(1).transform(parseAsNumber),
  AUTH_RATE_LIMIT_WINDOW_MS: z.string().min(1).transform(parseAsNumber),

  JWT_ACCESS_SECRET: z.string().min(20),
  JWT_ACCESS_EXPIRE_IN_SECOND: z.string().min(2).transform(parseAsNumber),

  JWT_REFRESH_SECRET: z.string().min(20),
  JWT_REFRESH_EXPIRE_IN_SECOND: z.string().min(3).transform(parseAsNumber),

  DATABASE_URL: z.string().url().min(1),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables:", parsed.error.format());
  throw new Error("Invalid environment variables");
}

const env = parsed.data;

export default env;
