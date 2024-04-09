import { Request, Response, NextFunction } from "express"
import Redis from 'ioredis'

export const client = new Redis();
export const loadTrails = async (req: Request, res: Response, next: NextFunction) => {

    
    client.keys('trail:*', (err, keys) => {
        if (err) {
            console.error("Error while getting trail key from redis cache! ", err);
            return;
        }
        if (!keys || !keys.length) {
            return next();
        }

        // Récupérer les valeurs associées à ces clés
        client.mget(keys, (err, trailJsonArray) => {
            if (err) {
                console.error("Error while getting trails array from redis cache! ", err);
                return;
            }

            // Traiter chaque valeur JSON récupérée
            const allTrails = trailJsonArray.map(json => JSON.parse(json));
           



            console.log("READING TRAILS FROM THE CACHE !************"); 


            return res.render("trails", { allTrails });
        });
    });






}