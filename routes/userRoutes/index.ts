import express from "express";
import * as userControllers from "../../controllers/userControllers/index";
import * as trailControllers from "../../controllers/trailsControllers/index";
import { sanitize } from "../../middlewares/sanitization/sanitize";
import { catchAsync } from "../../utils/catchAsync";
const userRouter=express.Router();


userRouter.get("/login",userControllers.getLogin);
userRouter.get("/signup",userControllers.getSignup);
userRouter.get("/profile",userControllers.getProfile);
userRouter.get("/signout",userControllers.getSignout);
userRouter.get("/logout", sanitize, catchAsync(userControllers.getLogout));

userRouter.get("/trails",trailControllers.userTrails);



userRouter.post("/login",  sanitize, catchAsync(userControllers.postLogin ));
userRouter.post("/signup", sanitize, catchAsync(userControllers.postSignup));
userRouter.post("/signout",sanitize, catchAsync(userControllers.postSignout));






export default userRouter;
