import { Router } from "express";
import { authMiddleware } from "../../middleware/auth";
import * as CartControllers from "../constrollers/cartControllers";

const CartRouter: Router = Router();

CartRouter.post("/", [authMiddleware], CartControllers.addItemToCart);
CartRouter.get("/:id", [authMiddleware], CartControllers.getCart);
CartRouter.get("/", [authMiddleware], CartControllers.getAllCart);
CartRouter.delete("/:id", [authMiddleware], CartControllers.delteItemFromCart);
CartRouter.patch("/:id", [authMiddleware], CartControllers.changeQuantity);

export default CartRouter;
