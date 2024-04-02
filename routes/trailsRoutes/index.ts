import express from "express";
import * as trailControllers from "../../controllers/trailsControllers/index";
import * as reviewControllers from "../../controllers/reviewsControllers/index";
import { sanitize } from "../../middlewares/sanitization/sanitize";
import {checkLogin} from "../../middlewares/auth/checkLogin";
import { checkAuthorizationForTrail } from "../../middlewares/auth/checkAuthorization";
import { checkAuthorizationForReview } from "../../middlewares/auth/checkAuthorization";
import { loadTrails } from "../../middlewares/redis-cache/loadTrails";
import {catchAsync} from '../../utils/catchAsync';



const trailRouter=express.Router();


trailRouter.get("/",checkLogin,loadTrails,catchAsync(trailControllers.allTrails));
trailRouter.get("/new",trailControllers.renderCreateTrail);
trailRouter.get("/:trail_id",sanitize,checkLogin,catchAsync(trailControllers.viewTrail));
trailRouter.get("/:trail_id/reviews",sanitize,checkLogin,reviewControllers.allReviews);

trailRouter.post("/add",sanitize,checkLogin, catchAsync(trailControllers.addTrail)); 
trailRouter.post("/:trail_id/delete",sanitize,checkLogin,checkAuthorizationForTrail,catchAsync(trailControllers.deleteTrail));

trailRouter.post("/:trail_id/reviews/add",catchAsync(reviewControllers.addReview));
trailRouter.post("/:trail_id/reviews/:review_id/edit",sanitize,checkLogin,checkAuthorizationForReview,catchAsync(reviewControllers.editReview));
trailRouter.post("/:trail_id/reviews/:review_id/delete",sanitize,checkLogin,checkAuthorizationForReview,catchAsync(reviewControllers.deleteReview));


export default trailRouter;