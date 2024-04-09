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
    exports.client.keys('trail:*', (err, keys) => {
        if (err) {
            console.error("Error while getting trail key from redis cache! ", err);
            return;
        }
        if (!keys || !keys.length) {
            return next();
        }
        // Récupérer les valeurs associées à ces clés
        exports.client.mget(keys, (err, trailJsonArray) => {
            if (err) {
                console.error("Error while getting trails array from redis cache! ", err);
                return;
            }
            // Traiter chaque valeur JSON récupérée
            const allTrails = trailJsonArray.map(json => JSON.parse(json));
            console.log("READING TRAILS FROM THE CACHE !************");
            return res.render("trails", { allTrails });
        });
    });
});
exports.loadTrails = loadTrails;
