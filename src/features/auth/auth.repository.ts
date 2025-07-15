import prisma from "../../prisma/client";
import env from "../../config/env";
import { RefreshToken, User } from "../../prisma/generated";
import { Request } from "express";
import { hashToken } from "./auth.utils";

type AddRefreshTokenToWhitelistParams = {
  refreshToken: string;
  userId: User["id"];
  userAgent: Request["headers"]["user-agent"];
  ipAddress: Request["ip"];
};

export const storeRefreshToken = async ({
  refreshToken,
  userId,
  userAgent,
  ipAddress,
}: AddRefreshTokenToWhitelistParams) => {
  const hashedToken = hashToken(refreshToken);
  const expireAt = new Date(
    Date.now() + env.JWT_REFRESH_EXPIRE_IN_SECOND * 1000,
  );
  return await prisma.refreshToken.create({
    data: {
      hashedToken,
      userId,
      expireAt,
      userAgent,
      ipAddress,
    },
  });
};

export const findRefreshToken = async (refreshToken: string) => {
  const hashedToken = hashToken(refreshToken);
  return await prisma.refreshToken.findUnique({
    where: {
      hashedToken,
    },
  });
};

export const revokeRefreshTokenById = async (id: RefreshToken["id"]) => {
  return await prisma.refreshToken.update({
    where: {
      id,
    },
    data: {
      revoked: true,
    },
  });
};
