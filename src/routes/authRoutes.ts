// import { login } from "./../constrollers/authControllers";
import { Router } from "express";
import * as authControllers from "../constrollers/authControllers";
// import { authMiddleware } from "../../middleware/auth";
import { errorMidleware } from "../../middleware/errors";
import { authMiddleware } from "../../middleware/auth";

// import * as authControllers from "../constrollers/authControllers";
// import login
const authRouter: Router = Router();

authRouter.use(errorMidleware);
authRouter.post("/signup", authControllers.signup);
authRouter.get("/login", authControllers.login);
authRouter.get("/me", [authMiddleware], authControllers.me);
authRouter.delete("/me/:userId", authControllers.deleteUser);

export default authRouter;
