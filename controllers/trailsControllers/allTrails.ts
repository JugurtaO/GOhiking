import { NextFunction, Request, Response } from "express";
import * as myModels from "../../models/index";
import Redis from "ioredis";

export const client = new Redis();

export const allTrails = async (req: Request, res: Response, next: NextFunction) => {


    //no need to await the operation
    const Trails = myModels.Trail.findAll();

    Trails.then(allTrails => {

        if (!allTrails.length) {
            req.flash("danger", "No trail was found, login and let's create one.");
            return res.redirect("/trails/new");
        }

        //adding all trails into redis 'trails' cache

        allTrails.forEach(trail => {


            client.sadd('trails', JSON.stringify(trail), (err, reply) => {
                if (err) {
                    console.error('Error while adding trail into redis cache !', err);
                    return;
                }
               
                //console.log('trail added successfully into redis cache');
            });
        })

        //Redis "trails" cache expires in 1h
        client.expire('trails',3060)

        console.log("READING FROM DB..")

        return res.render("trails", { allTrails });

    }).catch(err => {
        return next(err);
    })







};