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
exports.addTrail = exports.getLngLat = void 0;
const myModels = __importStar(require("../../models/index"));
const axios_1 = __importDefault(require("axios"));
const ioredis_1 = __importDefault(require("ioredis"));
//requiring ioredis client
const client = new ioredis_1.default();
function getLngLat(location) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiKey = String(process.env.TOMTOM_API_KEY);
        const url = `https://api.tomtom.com/search/2/geocode/${encodeURIComponent(location)}.json`;
        try {
            const response = yield axios_1.default.get(url, {
                params: {
                    key: apiKey,
                },
            });
            const data = response.data;
            if (response.status === 200 && data.results && data.results.length > 0) {
                const { lat, lon } = data.results[0].position;
                return [lon, lat];
            }
        }
        catch (error) {
            console.error('Failed to retrieve lnglat:', error);
        }
        return null;
    });
}
exports.getLngLat = getLngLat;
const addTrail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { trail_name, trail_location, difficulty_level, trail_image } = req.body;
    const author_id = req.session.active_user_id;
    if (!trail_name.length || !trail_location.length || !difficulty_level.length || !trail_image.length) {
        req.flash("danger", "Trail characteristics cannot be blank!");
        return res.redirect("/trails/new");
    }
    if (difficulty_level != "easy" && difficulty_level != "medium" && difficulty_level != "hard") {
        req.flash("danger", "The difficulty level can only be easy, medium or hard!");
        return res.redirect("/trails/new");
        // throw new expressError("difficulty level should be only easy, medium or hard !",500);
    }
    //check wether the wanted trail doesn't not already exist -- if not create new trail 
    const existedTrails = yield myModels.Trail.findAll({ where: { trail_name: trail_name } });
    if (existedTrails.length) {
        req.flash("danger", "Trail with given name already exists! ");
        return res.redirect("/trails/new");
    }
    //get trail  GPS coordinates from given location name
    const [longitude, latitude] = yield getLngLat(String(trail_location));
    // now we can create new trail 
    //no need to await the operation the user cannot see the effect behind the scenes
    const newTrail = myModels.Trail.create({ trail_name: trail_name, trail_location: trail_location, difficulty_level: difficulty_level, trail_image: trail_image + '/640x426', author_id: author_id, trail_longitude: longitude, trail_latitude: latitude })
        .then(data => {
        //Add new created trail to the cache
        //@ts-ignore
        client.set(`trail:${trail.trail_id}`, JSON.stringify(trail), (err, reply) => {
            if (err) {
                console.error('Error while adding trail into redis cache !', err);
                return;
            }
            //Redis "trail" cache expires in 1h
            //@ts-ignore
            client.expire(`trail:${trail.trail_id}`, 3600);
        });
        req.flash("success", "Trail created  uccessfuly.");
        return res.redirect(`/trails/${data.dataValues.trail_id}`);
    }).catch(err => {
        return next(err);
    });
});
exports.addTrail = addTrail;
