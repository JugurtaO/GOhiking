import express from "express";
import * as trailControllers from "../../controllers/trailsControllers/index";
import * as reviewControllers from "../../controllers/reviewsControllers/index";
import { sanitize } from "../../middlewares/sanitization/sanitize";
import {checkLogin} from "../../middlewares/auth/checkLogin";
import { checkAuthorizationForTrail } from "../../middlewares/auth/checkAuthorization";
import { checkAuthorizationForReview } from "../../middlewares/auth/checkAuthorization";
import { loadTrails } from "../../middlewares/redis-cache/loadTrails";
import {catchAsync} from '../../utils/catchAsync';
import { loadTrail } from "../../middlewares/redis-cache/loadTrail";



const trailRouter=express.Router();


//loadtrails from redis cache if they exist, otherwise from th db. {limit 16}
trailRouter.get("/",checkLogin,loadTrails,catchAsync(trailControllers.allTrails)); 

/*load all trails from th db. {no need to check whether the user is logged in }
*/
trailRouter.get("/mapTrails",catchAsync(trailControllers.mapTrails)); 
trailRouter.get("/new",trailControllers.renderCreateTrail);

//load trail from redis cache if they exist, otherwise from th db.
trailRouter.get("/:trail_id",sanitize,checkLogin,loadTrail,catchAsync(trailControllers.viewTrail));
//load reviews from the cache in the futur when needed to use particularly this controller
trailRouter.get("/:trail_id/reviews",sanitize,checkLogin,reviewControllers.allReviews);

trailRouter.post("/add",sanitize,checkLogin, catchAsync(trailControllers.addTrail)); 
trailRouter.post("/:trail_id/delete",sanitize,checkLogin,checkAuthorizationForTrail,catchAsync(trailControllers.deleteTrail));

trailRouter.post("/:trail_id/reviews/add",catchAsync(reviewControllers.addReview));
trailRouter.post("/:trail_id/reviews/:review_id/edit",sanitize,checkLogin,checkAuthorizationForReview,catchAsync(reviewControllers.editReview));
trailRouter.post("/:trail_id/reviews/:review_id/delete",sanitize,checkLogin,checkAuthorizationForReview,catchAsync(reviewControllers.deleteReview));


export default trailRouter;