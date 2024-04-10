import { NextFunction, Request, Response } from "express";
import * as myModels from "../../models/index";

export const mapTrails = async (req: Request, res: Response, next:NextFunction) => {

    const Trails = myModels.Trail.findAll();
    Trails.then(allTrails => {
        if (!allTrails.length) {
            req.flash("danger", `No trail was found`);
            return res.redirect("/home");

        }


        return res.json(allTrails);

    }).catch(err => {
        return next(err);
    });





};