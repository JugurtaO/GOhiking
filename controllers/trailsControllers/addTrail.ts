import { NextFunction, Request, Response } from "express";
import * as myModels from "../../models/index";
import axios from 'axios';
import Redis from "ioredis";

//requiring ioredis client
export const client = new Redis();

export async function getLngLat(location: string): Promise<[number, number] | null> {
    const apiKey = String(process.env.TOMTOM_API_KEY); // Replace with your TomTom API key
    const url = `https://api.tomtom.com/search/2/geocode/${encodeURIComponent(location)}.json`;
  
    try {
      const response = await axios.get(url, {
        params: {
          key: apiKey,
        },
      });
  
      const data = response.data;
      if (response.status === 200 && data.results && data.results.length > 0) {
        const { lat, lon } = data.results[0].position;
        return [lon, lat];
      }
    } catch (error) {
      console.error('Failed to retrieve lnglat:', error);
    }
  
    return null;
  }
  

export const addTrail = async (req: Request, res: Response,next:NextFunction) => {


    const { trail_name, trail_location, difficulty_level, trail_image }: { trail_name: String, trail_location: String, difficulty_level: String, trail_image: String } = req.body;
    const author_id = req.session.active_user_id;




    if (!trail_name.length || !trail_location.length || !difficulty_level.length || !trail_image.length) {
        req.flash("danger", "Trail characteristics cannot be blank!");
        return res.redirect("/trails/new");
    }

    if(difficulty_level !="easy" &&  difficulty_level!="medium" && difficulty_level!="hard" ){
      req.flash("danger", "The difficulty level can only be easy, medium or hard!");
      return res.redirect("/trails/new");
      // throw new expressError("difficulty level should be only easy, medium or hard !",500);

    }


    

    //check wether the wanted trail doesn't not already exist -- if not create new trail 

    const existedTrails = await myModels.Trail.findAll({ where: { trail_name: trail_name } });

    if (existedTrails.length) {
        req.flash("danger", "Trail with given name already exists! ");
        return res.redirect("/trails/new");
    }



    //get trail  GPS coordinates from given location name
     const [longitude,latitude]= await getLngLat(String(trail_location));
    
     
     
    // now we can create new trail 
    //no need to await the operation the user cannot see the effect behind the scenes
    const newTrail = myModels.Trail.create({ trail_name: trail_name, trail_location: trail_location, difficulty_level: difficulty_level, trail_image: trail_image+'/640x426', author_id: author_id,trail_longitude:longitude,trail_latitude:latitude })
        .then(data => {
            //Add new created trail to the cache
            client.sadd("trails", JSON.stringify(newTrail), (err, reply) => {
              if (err) {
                  console.error('Error while adding trail into redis cache !', err);
                  return;
              }

          });


            req.flash("success", "Trail created  uccessfuly.");
            return res.redirect(`/trails/${data.dataValues.trail_id}`);

        }).catch(err => {
           return next(err);
        });




    
     


 


};

