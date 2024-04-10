import { NextFunction, Request, Response } from "express";
import * as myModels from "../../models/index";
import Redis from "ioredis";
const client = new Redis();


export const deleteTrail = async (req: Request, res: Response, next: NextFunction) => {

    const { trail_id } = req.params;

    //delete hikes and reviews referencing corresponding trail before deleting it itself
    Promise.all([
        myModels.Hike.destroy({ where: { trail_id: trail_id } }),
        myModels.Review.destroy({ where: { trail_id: trail_id } })

    ]).then(data => {
        //first delete trail from db
        myModels.Trail.destroy({ where: { trail_id: trail_id } });

        //then update redis cache by removing the same trail from it
        client.del(`trail:${trail_id}`, (err, reply) => {
            if (err) {
                console.error('Error while deleting trail from the cache:', err);
                return;
            }
        });


        req.flash("success", `Successfuly deleted trail`);
        return res.redirect("/trails");

    }).catch(err => {
        return next(err);
    })








};