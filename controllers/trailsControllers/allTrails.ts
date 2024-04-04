import { NextFunction, Request, Response } from "express";
import * as myModels from "../../models/index";
import Redis from "ioredis";
import { convertToObject } from "typescript";

export const client = new Redis();

export const allTrails = async (req: Request, res: Response, next: NextFunction) => {


    //no need to await the operation
    const Trails = myModels.Trail.findAll();   //16

    Trails.then((allTrails) => {


        if (!allTrails.length) {
            req.flash("danger", "No trail was found, login and let's create one.");
            return res.redirect("/trails/new");
        }

        //adding all trails into redis 'trails' cache
        allTrails.forEach(trail => {
            

            //change trail  image resolution
            //@ts-ignore
            let strAsArray= trail.trail_image.split('/');
            let newArray= strAsArray.splice(strAsArray.length -1,1);
            let newRes= strAsArray.join('/') + "/640x426";

            //@ts-ignore
            trail.trail_image=newRes;
            
            client.sadd("trails", JSON.stringify(trail), (err, reply) => {
                if (err) {
                    console.error('Error while adding trail into redis cache !', err);
                    return;
                }

               

            });
        })

        //Redis "trails" cache expires in 1h
        client.expire("trails", 30)

        console.log("READING FROM DB..")

        return res.render("trails", { allTrails });

    }).catch(err => {
        return next(err);
    })







};