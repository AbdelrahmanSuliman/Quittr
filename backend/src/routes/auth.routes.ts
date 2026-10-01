import express from "express";
import { loginController, signupController, getCurrentUserController, logoutController } from "../controllers/auth.controller";
import { validateData } from "../middleware/validation.middleware";
import { UserLoginSchema, UserSignupSchema } from '../schema/auth.schema'
import verifyToken from "../middleware/verifyToken.middleware";

const authRouter = express.Router();

authRouter.post("/signup", validateData({body: UserSignupSchema}), signupController);
authRouter.post("/login", validateData({ body: UserLoginSchema }), loginController)
authRouter.get("/me", verifyToken, getCurrentUserController)
authRouter.post("/logout",verifyToken, logoutController)

export default authRouter