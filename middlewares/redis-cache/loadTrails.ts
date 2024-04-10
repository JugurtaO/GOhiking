import { Request, Response, NextFunction } from "express"
import Redis from 'ioredis'

const client = new Redis();
export const loadTrails = async (req: Request, res: Response, next: NextFunction) => {
    //get all registered trail keys
    client.keys('trail:*', (err, keys) => {
        if (err) {
            console.error("Error while getting trail key from redis cache! ", err);
            return;
        }
        if (!keys || !keys.length) {
            return next();
        }

        // then get the associated value for each key
        client.mget(keys, (err, trailJsonArray) => {
            if (err) {
                console.error("Error while getting trails array from redis cache! ", err);
                return;
            }

            
            const allTrails = trailJsonArray.map(json => JSON.parse(json));
            console.log("READING TRAILS FROM THE CACHE !************"); 


            return res.render("trails", { allTrails });
        });
    });






}