import { NextFunction, Request, Response } from "express";
import * as myModels from "../../models/index";
import Redis from 'ioredis'
import { Cookie } from "express-session";

const client = new Redis();
export const addReview = async (req: Request, res: Response, next: NextFunction) => {

    const { review_text, review_rating }: { review_text: String, review_rating: String } = req.body;
    const author_id = req.session.active_user_id;
    const user_nickname = req.session.active_user_nickname;
    const { trail_id } = req.params;

    if (!review_text.length) {
        req.flash("danger", `Review cannot be blank !`);
        return res.redirect(`/trails/${trail_id}`);
    }

    //no need to await the operation the user cannot see the effect behind the scenes
    const newReview = myModels.Review.create({ review_text: review_text, review_rating: review_rating, author_id: author_id, trail_id: trail_id });
    newReview.then(data => {
        //add trail review to the cache
        //@ts-ignore
        data.dataValues.User = { user_nickname }   //Add User field with user_nickname key-value pair into  data JS object 
        //@ts-ignore
        client.set(`Trail:${trail_id}:review:${data.dataValues.review_id}`, JSON.stringify(data), (err, reply) => {
            if (err) {
                console.error('Error while adding trail review into redis cache !', err);
                return;
            }

        });

        req.flash("success", `Thank you for leaving a review`);
        return res.redirect(`/trails/${trail_id}`);

    }).catch(err => {
        return next(err);
    });




};