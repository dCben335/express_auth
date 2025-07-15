import { Request, Response, NextFunction } from "express";

const successMiddleware = (req: Request, res: Response, next: NextFunction) => {
  res.success = (status: number, data: unknown, message: string) => {
    return res.status(status).json({
      success: true,
      message,
      data,
    });
  };
  next();
};

export default successMiddleware;
