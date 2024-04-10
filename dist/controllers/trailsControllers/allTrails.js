"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.allTrails = exports.client = void 0;
const myModels = __importStar(require("../../models/index"));
const ioredis_1 = __importDefault(require("ioredis"));
exports.client = new ioredis_1.default();
const allTrails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const Trails = myModels.Trail.findAll({ limit: 16 });
    Trails.then((allTrails) => {
        if (!allTrails.length) {
            req.flash("danger", "No trail was found, login and let's create one.");
            return res.redirect("/trails/new");
        }
        //adding all trails into redis cache 640x426 
        allTrails.forEach(trail => {
            //change trail  image resolution 
            //@ts-ignore
            let strAsArray = trail.trail_image.split('/');
            let newArray = strAsArray.splice(strAsArray.length - 1, 1);
            let newRes = strAsArray.join('/') + "/640x426";
            //@ts-ignore
            trail.trail_image = newRes;
            //@ts-ignore
            exports.client.set(`trail:${trail.trail_id}`, JSON.stringify(trail), (err, reply) => {
                if (err) {
                    console.error('Error while adding trail into redis cache !', err);
                    return;
                }
                //Make redis "trail" cache expires in 1h
                //@ts-ignore
                exports.client.expire(`trail:${trail.trail_id}`, 3600);
            });
        });
        console.log("READING FROM DB..");
        return res.render("trails", { allTrails });
    }).catch(err => {
        return next(err);
    });
});
exports.allTrails = allTrails;
