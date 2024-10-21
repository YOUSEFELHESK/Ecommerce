import { Router } from "express";
import * as userControllers from "../constrollers/userControllers";
import { authMiddleware } from "../../middleware/auth";
import { adminMiddleware } from "../../middleware/admin";

const UserRouter: Router = Router();

UserRouter.get(
  "/:userId",
  [authMiddleware, adminMiddleware],
  userControllers.GetOne
);
UserRouter.get(
  "/",
  [authMiddleware, adminMiddleware],
  userControllers.ListUsers
);

UserRouter.put(
  "/:userId/role",
  [authMiddleware, adminMiddleware],
  userControllers.updateUserRole
);

UserRouter.post("/address", [authMiddleware], userControllers.addAddress);
UserRouter.patch("/", [authMiddleware], userControllers.updateUserAddress);

UserRouter.delete(
  "/address/:addressId",
  [authMiddleware],
  userControllers.deleteAddress
);
UserRouter.get(
  "/address",
  [authMiddleware, adminMiddleware],
  userControllers.listAddress
);

export default UserRouter;
