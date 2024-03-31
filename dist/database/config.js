"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db_handler = void 0;
// here i will implement db_handler to create connection to JOhikes database;
const sequelize_1 = require("sequelize");
exports.db_handler = new sequelize_1.Sequelize(//new Sequelize(process.env.DB_URI);
String(process.env.DB_NAME), String(process.env.DB_USER), String(process.env.DB_PASSWORD), {
    host: process.env.DB_HOST,
    dialect: 'mysql'
});
