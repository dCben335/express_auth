import jwt from "jsonwebtoken";
import crypto from "crypto";
import { User } from "../../prisma/generated";
import env from "../../config/env";

const BYTES_LENGTH = 32;
const ENCODING = "base64url";
const HASH_ALGORITHM = "sha256";
const HASH_ENCODING = "hex";

export const hashToken = (token: string): string => {
  const hash = crypto.createHmac(HASH_ALGORITHM, env.JWT_REFRESH_SECRET);
  hash.update(token);
  return hash.digest(HASH_ENCODING);
};

const generateAccessToken = (userId: User["id"]) => {
  return jwt.sign({ userId }, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRE_IN_SECOND,
  });
};

const generateRefreshToken = () => {
  return crypto.randomBytes(BYTES_LENGTH).toString(ENCODING);
};

export const generateTokens = (userId: User["id"]) => {
  return {
    accessToken: generateAccessToken(userId),
    refreshToken: generateRefreshToken(),
  };
};
