import { UnauthorizedException } from "./../exceptions/unauthorized";
import { NextFunction, Request, Response } from "express";
import { User } from "@prisma/client";
import { ErrorCode } from "../exceptions/root";

export const adminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  console.log(user);
  if (user?.role == "ADMIN") {
    next();
  } else {
    next(new UnauthorizedException("unauthorized", ErrorCode.UNAUTHORIZED));
  }
};
