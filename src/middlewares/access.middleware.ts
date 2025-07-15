import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import env from "../config/env";
import ForbiddenError from "../utils/error/Forbidden.error";
import UnauthorizedError from "../utils/error/Unauthorized.error";

const accessMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];
  if (!token || !authHeader.startsWith("Bearer ")) {
    throw new ForbiddenError("Access token is required");
  }

  jwt.verify(token, env.JWT_ACCESS_SECRET, (err, decoded) => {
    if (err || !decoded || typeof decoded === "string") {
      throw new UnauthorizedError("Invalid or expired access token");
    }
    req.userId = decoded.userId;
    next();
  });
  next();
};

export default accessMiddleware;
