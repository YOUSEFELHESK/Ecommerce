import { ErrorCode } from "./../../exceptions/root";
import { Request, Response } from "express";
import { AddressSchema, UpdateUserSchema } from "../schema/users";
import { prisma } from "..";
import { errorhandler } from "../../error_handler";
import { NotFoundException } from "../../exceptions/not_found";
import { Address } from "@prisma/client";
import { BadRequestException } from "../../exceptions/bad request";
import { date } from "zod";

export const GetOne = errorhandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.userId, 10);
  try {
    const user = await prisma.user.findFirstOrThrow({
      where: { id: id },
      include: { address: true },
    });
    res.status(200).json(user);
  } catch (err) {
    throw new NotFoundException("user not found...!", ErrorCode.USER_NOT_FOUND);
  }
});

export const ListUsers = errorhandler(async (req: Request, res: Response) => {
  const count = await prisma.user.count();
  const users = await prisma.user.findMany({
    skip: Number(req.query.skip) || 0,
    take: 3,
  });

  res.status(200).json({
    status: "success",
    count,
    data: users,
  });
});

export const updateUserRole = errorhandler(
  async (req: Request, res: Response) => {
    const id = parseInt(req.params.userId, 10);
    console.log(id);
    try {
      const user = await prisma.user.update({
        where: {
          id: id,
        },
        data: {
          role: req.body.role,
        },
      });
      res.status(200).json(user);
    } catch (err) {
      throw new NotFoundException(
        "user not found...!",
        ErrorCode.USER_NOT_FOUND
      );
    }
  }
);

export const addAddress = errorhandler(async (req: Request, res: Response) => {
  AddressSchema.parse(req.body);

  const address = await prisma.address.create({
    data: {
      ...req.body,
      userId: req.user?.id,
    },
  });
  res.status(201).json({
    status: "success",
    data: address,
  });
});
export const deleteAddress = errorhandler(
  async (req: Request, res: Response) => {
    try {
      const id = +req.params.addressId;

      await prisma.address.delete({ where: { id: id } });

      res.json({
        status: "success",
      });
    } catch (err) {
      throw new NotFoundException(
        "the address is not found",
        ErrorCode.USER_NOT_FOUND
      );
    }
  }
);
export const listAddress = errorhandler(async (req: Request, res: Response) => {
  try {
    const count = await prisma.address.count();
    const addresses = await prisma.address.findMany({
      skip: Number(req.query.skip) || 0,
      take: 2,
    });
    res.status(200).json({
      status: "success",
      count,
      data: addresses,
    });
  } catch (err) {
    throw new NotFoundException(
      "the address is not found",
      ErrorCode.USER_NOT_FOUND
    );
  }
});

export const updateUserAddress = async (req: Request, res: Response) => {
  const validateData = UpdateUserSchema.parse(req.body);

  console.log(validateData);
  let shippingAddress: Address;
  let billingAddress: Address;

  if (validateData.defualtShippingAddress) {
    try {
      shippingAddress = await prisma.address.findFirstOrThrow({
        where: {
          id: validateData.defualtShippingAddress,
        },
      });
      if (!shippingAddress || shippingAddress.userId != req.user?.id) {
        throw new BadRequestException(
          "Address does not belong to user",
          ErrorCode.USER_NOT_FOUND
        );
      }
    } catch (err) {
      throw new BadRequestException(
        "Address not found",
        ErrorCode.USER_NOT_FOUND
      );
    }
  }

  if (validateData.defualtBillingAddress) {
    try {
      billingAddress = await prisma.address.findFirstOrThrow({
        where: {
          id: validateData.defualtBillingAddress,
        },
      });

      if (!billingAddress || billingAddress.userId != req.user?.id) {
        throw new BadRequestException(
          "Address does not belong to user",
          ErrorCode.USER_NOT_FOUND
        );
      }
    } catch (err) {
      throw new BadRequestException(
        "Address not found",
        ErrorCode.USER_NOT_FOUND
      );
    }
  }

  const dataToUpdate: any = {
    name: validateData.name ?? undefined,
    defualtShippingAddress: validateData.defualtShippingAddress ?? undefined,
    defualtBillingAddress: validateData.defualtBillingAddress ?? undefined,
  };

  const updateUser = await prisma.user.update({
    where: {
      id: req.user?.id,
    },
    data: dataToUpdate,
  });

  res.json({
    status: "success",
    data: updateUser,
  });
};
