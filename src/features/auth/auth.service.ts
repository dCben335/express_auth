import { Request } from "express";
import { generateTokens } from "./auth.utils";
import { findRefreshToken, revokeRefreshTokenById, storeRefreshToken } from "./auth.repository";

export const handleTokens = async (userId: string, req: Request) => {
	const tokens = generateTokens(userId);
	await storeRefreshToken({
		refreshToken: tokens.refreshToken,
		userId,
		userAgent: req.headers["user-agent"] || "",
		ipAddress: req.ip || "",
	});
	return tokens;
};

export const findAndRevokeToken = async (refreshToken: string) => {
	const token = await findRefreshToken(refreshToken);
	if (!token || token.revoked || token.expireAt < new Date()) {
		return null;
	}	
	await revokeRefreshTokenById(token.id);
	return token;
}