import { NextFunction, Request, Response } from "express";
import { httpEXceptions } from "../exceptions/root";

export const errorMidleware = (
  error: httpEXceptions,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(error.statusCode).json({
    message: error.message,
    errorCode: error.errorCode,
    errors: error.errors,
  });
};
