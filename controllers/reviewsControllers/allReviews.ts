import { NextFunction, Request, Response } from "express";
import * as myModels from "../../models/index";

export const allReviews = async  (req: Request, res: Response, next:NextFunction) => {

    const {trail_id}=req.params;
    
    //no need to await the operation
    const Reviews = myModels.Review.findAll({where:{trail_id:trail_id}});

    Reviews.then(allReviews => {

        if (!allReviews.length){
            req.flash("danger",`No review was found, login and let's create one.`);
            return res.redirect(`/trails/${trail_id}/reviews`);
        }
        
        return res.json(allReviews );

    }).catch(err => {
        return next(err);
    })







};