import { Request, Response } from "express-serve-static-core";
import { errorhandler } from "../../error_handler";
import { prisma } from "..";
import { NotFoundException } from "../../exceptions/not_found";
import { ErrorCode } from "../../exceptions/root";

export const createOrder = errorhandler(async (req: Request, res: Response) => {
  return await prisma.$transaction(async (tx) => {
    const cartItems = await tx.cartItem.findMany({
      where: {
        userId: req.user?.id,
      },
      include: {
        product: true,
      },
    });
    if (cartItems.length == 0) {
      return res.json({ message: "Cart is empty.....!" });
    }
    const price = cartItems.reduce((prev, current) => {
      return prev + current.quantity * +current.product.price;
    }, 0);
    const address = await tx.address.findFirst({
      where: {
        id: req.user?.defualtShippingAddress,
      },
    });
    const order = await tx.order.create({
      data: {
        userId: req.user?.id,
        netAmount: price,
        address: address ? address.formattedAddress : "",

        products: {
          create: cartItems.map((cart) => {
            return {
              productId: cart.productId,
              quantity: cart.quantity,
              userId: req.user?.id,
            };
          }),
        },
      },
    });
    const ordeEvent = await tx.orderEvent.create({
      data: {
        orderId: order.id,
      },
    });
    await tx.cartItem.deleteMany({
      where: {
        userId: req.user?.id,
      },
    });
    return res.json(order);
  });
});

export const listMyOrders = errorhandler(
  async (req: Request, res: Response) => {
    const count = await prisma.order.count({
      where: {
        userId: req.user?.id,
      },
    });

    const orders = await prisma.order.findMany({
      where: {
        userId: req.user?.id,
      },
      include: {
        products: true,
      },
    });
    return res.json({
      count,
      data: orders,
    });
  }
);
// export const listAllOrders = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const count = await prisma.order.count();
//     console.log(count);

//     const orders = await prisma.order.findMany();

//     if (orders.length === 0) {
//       res.status(404).json({ message: "No orders found" });
//       return; // إنهاء الدالة بعد إرسال الاستجابة
//     }

//     res.json({
//       count,
//       data: orders,
//     });
//   } catch (err) {
//     console.error("Error fetching orders:", err);
//     res
//       .status(500)
//       .json({ message: "An error occurred while fetching orders." });
//   }
// };

export const listAllOrders = errorhandler(
  async (req: Request, res: Response) => {
    let whereClause = {};
    const status = req.query.status;
    if (status) {
      whereClause = { status };
    }
    const count = await prisma.order.count({ where: whereClause });
    const orders = await prisma.order.findMany({
      where: whereClause,
      skip: Number(req.query.skip) || 0,
      take: 3,
    });
    res.json({
      status: "success",
      count,
      data: orders,
    });
  }
);

export const listUserOrders = errorhandler(
  async (req: Request, res: Response) => {
    const count = await prisma.order.count();

    const orders = await prisma.order.findMany({
      where: {
        id: +req.params.userId,
      },
      skip: Number(req.query.skip) || 0,
      take: 2,
      include: {
        products: true,
      },
    });
    return res.json({
      count,
      data: orders,
    });
  }
);

export const ChangeOrderStatus = errorhandler(
  async (req: Request, res: Response) => {
    try {
      const order = await prisma.order.update({
        where: {
          id: +req.params.id,
        },
        data: {
          status: req.body.status,
        },
      });
      await prisma.orderEvent.create({
        data: {
          orderId: order.id,
          status: req.body.status,
        },
      });
      res.json(order);
    } catch (err) {
      throw new NotFoundException("order not found", ErrorCode.USER_NOT_FOUND);
    }
  }
);

export const cancelOrder = errorhandler(async (req: Request, res: Response) => {
  try {
    const order = await prisma.order.update({
      where: {
        id: +req.params.id,
      },
      data: {
        status: "CANCELLED",
      },
    });
    await prisma.orderEvent.create({
      data: {
        orderId: order.id,
        status: order.status,
      },
    });
    res.json(order);
  } catch (err) {
    throw new NotFoundException("order not found", ErrorCode.USER_NOT_FOUND);
  }
});

export const getOneOrder = errorhandler(async (req: Request, res: Response) => {
  try {
    const order = await prisma.order.findFirstOrThrow({
      where: {
        id: +req.params.id,
      },
      include: {
        products: true,
        events: true,
      },
    });
    res.json(order);
  } catch (err) {
    throw new NotFoundException("order not found", ErrorCode.USER_NOT_FOUND);
  }
});
