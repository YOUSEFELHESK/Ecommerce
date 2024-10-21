import { Router } from "express";

import authRouter from "./authRoutes";
import ProductRouter from "./prodRoutes";
import UserRouter from "./usersRoutes";
import CartRouter from "./cartRoutes";
import OrderRouter from "./orderRoutes";

const rootRouter: Router = Router();

rootRouter.use("/auth", authRouter);
rootRouter.use("/users", UserRouter);
rootRouter.use("/products", ProductRouter);
rootRouter.use("/carts", CartRouter);
rootRouter.use("/orders", OrderRouter);

export default rootRouter;
