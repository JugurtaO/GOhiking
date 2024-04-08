import { NextFunction, Request,Response } from "express";
import * as myModels from "../../models/index";

export const deleteReview= async (req:Request,res:Response,next:NextFunction)=>{

    const {review_id,trail_id}=req.params;

    const allReviews=await myModels.Review.findAll({where:{review_id:review_id}});
    
   
    if (!allReviews.length || allReviews.length!=1){
        
        req.flash("danger",`no review found with given data`);
        return res.redirect(`/trails/${trail_id}`);
        
    
    }
    
    
    if (allReviews[0].dataValues.author_id != req.session.active_user_id){
        
        req.flash("danger",`not authorized to delete this review !`);
        return res.status(401).redirect(`/trails/${trail_id}`);
        
    
    }

    const review=myModels.Review.destroy({where:{review_id:review_id}})
    .then(data=>{
        req.flash("success",` review successfuly deleted.`);
        return res.redirect(`/trails/${trail_id}`)
    }).catch(err=>{
        return next(err);
    });
  

    

};