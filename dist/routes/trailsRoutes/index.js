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
const trailControllers = __importStar(require("../../controllers/trailsControllers/index"));
const reviewControllers = __importStar(require("../../controllers/reviewsControllers/index"));
const sanitize_1 = require("../../middlewares/sanitization/sanitize");
const checkLogin_1 = require("../../middlewares/auth/checkLogin");
const checkAuthorization_1 = require("../../middlewares/auth/checkAuthorization");
const checkAuthorization_2 = require("../../middlewares/auth/checkAuthorization");
const loadTrails_1 = require("../../middlewares/redis-cache/loadTrails");
const catchAsync_1 = require("../../utils/catchAsync");
const trailRouter = express_1.default.Router();
//Fetch trails from redis cache if they exist, otherwise from th db.
trailRouter.get("/", checkLogin_1.checkLogin, loadTrails_1.loadTrails, (0, catchAsync_1.catchAsync)(trailControllers.allTrails));
trailRouter.get("/new", trailControllers.renderCreateTrail);
trailRouter.get("/:trail_id", sanitize_1.sanitize, checkLogin_1.checkLogin, (0, catchAsync_1.catchAsync)(trailControllers.viewTrail));
trailRouter.get("/:trail_id/reviews", sanitize_1.sanitize, checkLogin_1.checkLogin, reviewControllers.allReviews);
trailRouter.post("/add", sanitize_1.sanitize, checkLogin_1.checkLogin, (0, catchAsync_1.catchAsync)(trailControllers.addTrail));
trailRouter.post("/:trail_id/delete", sanitize_1.sanitize, checkLogin_1.checkLogin, checkAuthorization_1.checkAuthorizationForTrail, (0, catchAsync_1.catchAsync)(trailControllers.deleteTrail));
trailRouter.post("/:trail_id/reviews/add", (0, catchAsync_1.catchAsync)(reviewControllers.addReview));
trailRouter.post("/:trail_id/reviews/:review_id/edit", sanitize_1.sanitize, checkLogin_1.checkLogin, checkAuthorization_2.checkAuthorizationForReview, (0, catchAsync_1.catchAsync)(reviewControllers.editReview));
trailRouter.post("/:trail_id/reviews/:review_id/delete", sanitize_1.sanitize, checkLogin_1.checkLogin, checkAuthorization_2.checkAuthorizationForReview, (0, catchAsync_1.catchAsync)(reviewControllers.deleteReview));
exports.default = trailRouter;
