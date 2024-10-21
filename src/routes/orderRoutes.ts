import { Router } from "express";
import { authMiddleware } from "../../middleware/auth";
import * as OrderControllers from "../constrollers/OrderControllers";
import { adminMiddleware } from "../../middleware/admin";

const OrderRouter: Router = Router();
OrderRouter.get(
  "/All",
  [authMiddleware, adminMiddleware],
  OrderControllers.listAllOrders
);
OrderRouter.post("/", [authMiddleware], OrderControllers.createOrder);

OrderRouter.get("/", [authMiddleware], OrderControllers.listMyOrders);

OrderRouter.get(
  "/users/:userId",
  [authMiddleware, adminMiddleware],
  OrderControllers.listUserOrders
);
OrderRouter.get("/:id", [authMiddleware], OrderControllers.getOneOrder);

OrderRouter.put("/:id/cancel", [authMiddleware], OrderControllers.cancelOrder);
OrderRouter.put(
  "/:id/status",
  [authMiddleware, adminMiddleware],
  OrderControllers.ChangeOrderStatus
);

export default OrderRouter;
