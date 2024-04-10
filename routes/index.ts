import express from "express";
import userRoutes from "./userRoutes/index";
import otherRoutes from "./otherRoutes/index";
import trailRoutes from "./trailsRoutes/index";


const Router=express.Router();


Router.use("/",otherRoutes);
Router.use("/users",userRoutes);   
Router.use("/trails",trailRoutes);



export default Router;
