import { UnauthorizedException } from "./../exceptions/unauthorized";
import { NextFunction, Request, Response } from "express";
import { ErrorCode } from "../exceptions/root";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../src/secrets";
import { prisma } from "../src";
import { User } from "@prisma/client";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //1. extract the token from the header:
  const token = req.headers.authorization;
  //2. if the token is not present, throw an error of unauthorozed:
  if (!token)
    next(new UnauthorizedException("unauthorized", ErrorCode.UNAUTHORIZED));

  try {
    //3. if the token is present, verify that the token and exptract the payload:
    const payload = jwt.verify(token as string, JWT_SECRET) as {
      userId: number;
    };
    // console.log(payload);
    //4. to get the user from the payload:
    const user = await prisma.user.findFirst({ where: { id: payload.userId } });
    // console.log(user);
    //5. to attach the user to the current request object:
    req.user = user as User;
    next();
  } catch (err) {
    next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
  }
};
