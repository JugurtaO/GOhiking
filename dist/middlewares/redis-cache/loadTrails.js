"use strict";
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
exports.loadTrails = exports.client = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
exports.client = new ioredis_1.default();
const loadTrails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const cachedTrails = yield exports.client.smembers('trails');
    //if the cache is empty then call next to move into the correspondign controller 
    if (!cachedTrails || !cachedTrails.length) {
        return next();
    }
    console.log("READING FROM THE CACHE ..");
    //else, retreive data from the cache
    const allTrails = [];
    cachedTrails.forEach(trail => {
        //console.log("REDIS:", trail)
        allTrails.push(JSON.parse(trail));
    });
    return res.render("trails", { allTrails });
});
exports.loadTrails = loadTrails;
