import { NextFunction, Request, Response } from "express";
import * as myModels from "../../models/index";

import Redis from 'ioredis'

export const client =new Redis();
export const viewTrail = async (req: Request, res: Response,next:NextFunction) => {

    const { trail_id } = req.params;

    const trail = myModels.Trail.findOne({ where: { trail_id: trail_id } });

    trail.then(async Trail => {
        if (Trail === null){
            req.flash("danger",`No trail was found !`);
            return res.redirect("/trails");
            
        }

        // load all trail reviews & their author
        const allReviews = await myModels.Review.findAll({include:{model:myModels.User},where: { trail_id: trail_id }, limit: 10 });

        // add them into the cache
        allReviews.forEach(review =>{
            //@ts-ignore
            client.set(`Trail:${trail_id}:review:${review.review_id}`, JSON.stringify(review), (err, reply) => {
                if (err) {
                    console.error('Error while adding trail review into redis cache !', err);
                    return;
                }
            });

            //Redis "review" cache expires in 1h
            //@ts-ignore
            client.expire(`Trail:${trail_id}:review:${review.review_id}`, 3600)
        })


        return res.render("viewTrail", { Trail, allReviews });
        


    }).catch(err => {
        return next(err);
    });





};