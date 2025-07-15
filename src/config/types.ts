import "express";

type Status = 200 | 201;

declare global {
  namespace Express {
    interface Response {
      success: (status: Status, data: unknown, message: string) => Response;
    }
    interface Request {
      userId?: string;
    }
  }
}
