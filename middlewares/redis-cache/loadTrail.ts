import { Request, Response, NextFunction } from "express"
import Redis from 'ioredis'

export const client = new Redis();

export const loadTrail = async (req: Request, res: Response, next: NextFunction) => {

    const { trail_id } = req.params;

    client.get(`trail:${trail_id}`, (err, trailJson) => {
        if (err) {
            console.error(`Error while fetching trail from redis cache !`, err);
            return;
        }

        //if the requested_trail doesn't exist in the cache then call next to move into the correspondign controller 
        if (!trailJson) {
            return next();
        }



        //otherwise render it directly from the cache
        const Trail = JSON.parse(trailJson);



        client.keys(`Trail:${trail_id}:review:*`, (err, keys) => {
            if (err) {
                console.error("Error while getting trail reviews key from redis cache! ", err);
                return;
            }


            if (keys && keys.length) {
                // Récupérer les valeurs associées à ces clés
                client.mget(keys, (err, trailReviewsJsonArray) => {
                    if (err) {
                        console.error("Error while getting trails array from redis cache! ", err);
                        return;
                    }

                    // Traiter chaque valeur JSON récupérée
                    const allReviews = trailReviewsJsonArray.map(json => JSON.parse(json));


                    console.log("READING TRAIL  AND REVIEWS FROM THE CACHE ..")

                    return res.render("viewTrail", { Trail, allReviews });
                });

            } else {
               
                const allReviews: any[] = []
                return res.render("viewTrail", { Trail, allReviews });
            }


        });






    });



}