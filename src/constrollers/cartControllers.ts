import { CartItem } from "./../../node_modules/.prisma/client/index.d";
import { Product } from "@prisma/client";
import { errorhandler } from "../../error_handler";
import { CartSchema, ChangeQuantitySchema } from "../schema/cart";
import { NotFoundException } from "../../exceptions/not_found";
import { ErrorCode } from "../../exceptions/root";
import { prisma } from "..";
import { Request, Response } from "express";
import { date } from "zod";

export const addItemToCart = errorhandler(
  async (req: Request, res: Response) => {
    const validateData = CartSchema.parse(req.body);
    let product: Product;

    try {
      product = await prisma.product.findFirstOrThrow({
        where: { id: validateData.productId },
      });
    } catch (err) {
      throw new NotFoundException(
        "product not found ..!",
        ErrorCode.USER_NOT_FOUND
      );
    }

    const cart = await prisma.cartItem.create({
      data: {
        userId: req.user?.id,
        productId: product.id,
        quantity: validateData.quantity,
      },
    });
    res.json(cart);
  }
);
export const delteItemFromCart = errorhandler(
  async (req: Request, res: Response) => {
    try {
      const product = await prisma.product.findFirst({
        where: { id: +req.params.id },
      });
      if (product) {
        await prisma.cartItem.delete({ where: { id: +req.params.id } });
        res.json("success");
      }
    } catch (err) {
      throw new NotFoundException(
        "product not found ..!",
        ErrorCode.USER_NOT_FOUND
      );
    }
  }
);

export const getCart = errorhandler(async (req: Request, res: Response) => {
  try {
    const cart = await prisma.cartItem.findFirst({
      where: { id: +req.params.id },
    });
    res.json({
      date: {
        status: "success",
        date: cart,
      },
    });
  } catch (err) {
    throw new NotFoundException(
      "product not found ..!",
      ErrorCode.USER_NOT_FOUND
    );
  }
});
export const getAllCart = errorhandler(async (req: Request, res: Response) => {
  try {
    const carts = await prisma.cartItem.findMany({
      where: { userId: +req.user?.id },
    });
    res.json({
      date: {
        status: "success",
        date: carts,
      },
    });
  } catch (err) {
    throw new NotFoundException(
      "product not found ..!",
      ErrorCode.USER_NOT_FOUND
    );
  }
});

export const changeQuantity = errorhandler(
  async (req: Request, res: Response) => {
    const validateData = ChangeQuantitySchema.parse(req.body);
    const updateCart = await prisma.cartItem.update({
      where: {
        id: +req.params.id,
      },
      data: {
        quantity: validateData.quantity,
      },
    });
    res.json({
      status: "success",
      data: updateCart,
    });
  }
);
