// here i will implement db_handler to create connection to JOhikes database;
import { ScrollZoomHandler } from "@tomtom-international/web-sdk-maps";
import { Sequelize } from "sequelize";


export const db_handler = new Sequelize(process.env.DB_URI);
    // String(process.env.DB_NAME),
    // String(process.env.DB_USER),
    // String(process.env.DB_PASSWORD),
    // {
    //     host:process.env.DB_HOST, 
    //     dialect:'mysql'
    // }

