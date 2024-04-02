import { channel } from "diagnostics_channel";
import { Request,Response,NextFunction } from "express"
import Redis from 'ioredis'

export const client =new Redis();
export const loadTrails =  async(req:Request,res:Response,next:NextFunction) =>{
    
    const cachedTrails= await client.smembers('trails');

    //if the cache is empty then call next to move into the correspondign controller 
    if(!cachedTrails || !cachedTrails.length){
        return next();
    }

    console.log("READING FROM THE CACHE ..")
    //else, retreive data from the cache
    const allTrails: any[]=[];
   
    cachedTrails.forEach(trail=>{
        //console.log("REDIS:", trail)
        allTrails.push(JSON.parse(trail))
    })
    return res.render("trails", { allTrails });



}