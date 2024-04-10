"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userControllers = __importStar(require("../../controllers/userControllers/index"));
const trailControllers = __importStar(require("../../controllers/trailsControllers/index"));
const sanitize_1 = require("../../middlewares/sanitization/sanitize");
const catchAsync_1 = require("../../utils/catchAsync");
const userRouter = express_1.default.Router();
userRouter.get("/login", userControllers.getLogin);
userRouter.get("/signup", userControllers.getSignup);
userRouter.get("/profile", userControllers.getProfile);
userRouter.get("/signout", userControllers.getSignout);
userRouter.get("/logout", sanitize_1.sanitize, (0, catchAsync_1.catchAsync)(userControllers.getLogout));
userRouter.get("/trails", trailControllers.allTrails);
userRouter.post("/login", sanitize_1.sanitize, (0, catchAsync_1.catchAsync)(userControllers.postLogin));
userRouter.post("/signup", sanitize_1.sanitize, (0, catchAsync_1.catchAsync)(userControllers.postSignup));
userRouter.post("/signout", sanitize_1.sanitize, (0, catchAsync_1.catchAsync)(userControllers.postSignout));
exports.default = userRouter;
