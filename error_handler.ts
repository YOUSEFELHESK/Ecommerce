import { NextFunction, Request, Response } from "express";
import { ErrorCode, httpEXceptions } from "./exceptions/root";
import { InternalException } from "./exceptions/intrnal_exception";
import { ZodError } from "zod";
import { BadRequestException } from "./exceptions/bad request";

export const errorhandler = (method: Function) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await method(req, res, next);
    } catch (error: any) {
      let exception: httpEXceptions;
      if (error instanceof httpEXceptions) exception = error;
      else {
        if (error instanceof ZodError) {
          exception = new BadRequestException(
            "Unprocessable entity.",
            ErrorCode.UNPROCESSABLE_ENTITY
          );
        } else {
          exception = new InternalException(
            "something went wrong",
            error,
            ErrorCode.INTRNAL_ERROR
          );
        }
      }

      next(exception);
    }
  };
};
