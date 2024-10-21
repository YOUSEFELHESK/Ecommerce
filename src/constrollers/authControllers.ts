import { UnauthorizedException } from "./../../exceptions/unauthorized";
import { NotFoundException } from "./../../exceptions/not_found";
import { errorhandler } from "./../../error_handler";
import { SignupShema } from "./../schema/users";
import { NextFunction, Request, Response } from "express";
// import { db } from "../../server";
import { Prisma } from "@prisma/client";
import { hashSync, compareSync } from "bcrypt";
import { prisma } from "..";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";
import { BadRequestException } from "../../exceptions/bad request";
import { ErrorCode } from "../../exceptions/root";
import { UnprocessableEntity } from "../../exceptions/validation";
import { any, number } from "zod";

export const signup = errorhandler(
  async (req: Request, res: Response, next: NextFunction) => {
    SignupShema.parse(req.body);
    const { name, email, password } = req.body;
    let user = await prisma.user.findFirst({ where: { email } });
    console.log(name, email, password);
    if (user)
      new BadRequestException(
        "user already exists",
        ErrorCode.USER_ALREDY_EXISTS
      );

    user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashSync(password, 10),
      },
    });
    res.status(201).json({
      status: "success",
      data: user,
    });
  }
);

export const login = errorhandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    if (!email || !password)
      throw new BadRequestException(
        "email and password are required",
        ErrorCode.UNPROCESSABLE_ENTITY
      );
    const user = await prisma.user.findFirst({ where: { email } });

    if (!user)
      throw new NotFoundException(
        "user does not exists",
        ErrorCode.INCORRECT_PASSWORD
      );
    if (!compareSync(password, user.password))
      throw new NotFoundException(
        "password is not correct",
        ErrorCode.INCORRECT_PASSWORD
      );

    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    res.status(200).json({
      status: "success",
      data: {
        user,
        token,
      },
    });
  }
);

export const me = errorhandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    res.status(200).json(user);
  }
);

export const deleteUser = errorhandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.userId, 10);

    const user = await prisma.user.delete({ where: { id: id } });

    // console.log(req.user);
    res.status(200).json("success");
  }
);
