import { adminMiddleware } from "./../../middleware/admin";
import { Router } from "express";
import * as prodcontrollers from "../constrollers/prodControllers";
import { authMiddleware } from "../../middleware/auth";
const ProductRouter: Router = Router();

ProductRouter.post(
  "/",
  [authMiddleware, adminMiddleware],
  prodcontrollers.createProduct
);
ProductRouter.put(
  "/:id",
  [authMiddleware, adminMiddleware],
  prodcontrollers.updateProduct
);

ProductRouter.get(
  "/",
  [authMiddleware, adminMiddleware],
  prodcontrollers.listProduct
);
ProductRouter.delete(
  "/:id",
  [authMiddleware, adminMiddleware],
  prodcontrollers.deleteProduct
);
ProductRouter.get("/search", [authMiddleware], prodcontrollers.searchProducts);
ProductRouter.get(
  "/:id",
  [authMiddleware, adminMiddleware],
  prodcontrollers.updateProduct
);

export default ProductRouter;
