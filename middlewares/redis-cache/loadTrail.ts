import { Request, Response, NextFunction } from "express"
import Redis from 'ioredis'

export const client = new Redis();

export const loadTrail = async (req: Request, res: Response, next: NextFunction) => {

    const { trail_id } = req.params;

    const cachedTrails = await client.smembers("trails");

   
    // Find the trail with the matching trail_id.
    let Trail= cachedTrails.find(trail => {
        const parsedTrail = JSON.parse(trail);
        return parsedTrail.trail_id === trail_id;
    });

   
   
    console.log("**************", Trail)


    //if the requested_trail doesn't exist in the cache then call next to move into the correspondign controller 

    
    if (!Trail) {
        return next();
    }

    //otherwise render it directly from the cache
    // Trail = await client.hget('trails', trail_id);

    //Now load associated trail reviews into the cache
    const cachedTrailReviews = await client.smembers('reviews');

    //if the cache is empty then call next to move into the correspondign controller 
    if (!cachedTrailReviews || !cachedTrailReviews.length) {
        return next();
    }

    console.log("READING FROM THE CACHE ..")
    //else, retrieve data from the cache
    const allReviews: any[] = [];

    cachedTrailReviews.forEach(review => {
        console.log("REDIS REVIEW:", review)
        //@ts-ignore
        if (review.trail_id == trail_id)
            allReviews.push(JSON.parse(review))
    })



    console.log("READING TRAIL  AND REVIEWS FROM THE CACHE ..")

    return res.render("viewTrail", { Trail, allReviews });



}