import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { prisma } from "..";
// import { date } from "zod";
import { errorhandler } from "../../error_handler";
import { NotFoundException } from "../../exceptions/not_found";
import { ErrorCode } from "../../exceptions/root";
import { date } from "zod";

export const createProduct = errorhandler(
  async (req: Request, res: Response) => {
    const product = await prisma.product.create({
      data: {
        ...req.body,
        tags: req.body.tags.join(","),
      },
    });

    res.status(201).json({
      status: "success",
      data: product,
    });
  }
);

export const updateProduct = errorhandler(
  async (req: Request, res: Response) => {
    try {
      const productId = +req.params.id;
      const product = await prisma.product.findFirst({
        where: { id: productId },
      });

      if (Array.isArray(product?.tags)) {
        product.tags = product.tags.join(",");
      }
      const newProduct = await prisma.product.update({
        where: { id: productId },
        data: req.body,
      });

      res.status(200).json({
        status: "success",
        data: newProduct,
      });
    } catch (err) {
      throw new NotFoundException(
        "the product is not found",
        ErrorCode.USER_NOT_FOUND
      );
    }
  }
);
export const getProduct = errorhandler(async (req: Request, res: Response) => {
  try {
    const productId = +req.params.id;
    const product = await prisma.product.findFirst({
      where: { id: productId },
    });

    res.status(200).json({
      status: "success",
      data: product,
    });
  } catch (err) {
    throw new NotFoundException(
      "the product is not found",
      ErrorCode.USER_NOT_FOUND
    );
  }
});
export const listProduct = errorhandler(async (req: Request, res: Response) => {
  try {
    const count = await prisma.product.count();
    const products = await prisma.product.findMany({
      skip: Number(req.query.skip) || 0,
      take: 2,
    });
    res.status(200).json({
      status: "success",
      count,
      data: products,
    });
  } catch (err) {
    throw new NotFoundException(
      "the product is not found",
      ErrorCode.USER_NOT_FOUND
    );
  }
});

export const deleteProduct = errorhandler(
  async (req: Request, res: Response) => {
    try {
      const productId = +req.params.id;
      await prisma.product.delete({
        where: { id: productId },
      });
      res.status(200).json({
        status: "success",
      });
    } catch (err) {
      throw new NotFoundException(
        "the product is not found",
        ErrorCode.USER_NOT_FOUND
      );
    }
  }
);

export const searchProducts = async (req: Request, res: Response) => {
  const products = await prisma.product.findMany({
    where: {
      name: {
        search: req.query.q?.toString(),
      },
      tags: {
        search: req.query.q?.toString(),
      },
      description: {
        search: req.query.q?.toString(),
      },
    },
  });

  res.json(products);
};
