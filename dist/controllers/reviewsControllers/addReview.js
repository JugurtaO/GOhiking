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
exports.addReview = void 0;
const myModels = __importStar(require("../../models/index"));
const ioredis_1 = __importDefault(require("ioredis"));
const client = new ioredis_1.default();
const addReview = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { review_text, review_rating } = req.body;
    const author_id = req.session.active_user_id;
    const user_nickname = req.session.active_user_nickname;
    const { trail_id } = req.params;
    if (!review_text.length) {
        req.flash("danger", `Review cannot be blank !`);
        return res.redirect(`/trails/${trail_id}`);
    }
    //no need to await the operation the user cannot see the effect behind the scenes
    const newReview = myModels.Review.create({ review_text: review_text, review_rating: review_rating, author_id: author_id, trail_id: trail_id });
    newReview.then(data => {
        //add trail review to the cache
        //@ts-ignore
        data.dataValues.User = { user_nickname }; //Add User field with user_nickname key-value pair into  data JS object 
        //@ts-ignore
        client.set(`Trail:${trail_id}:review:${data.dataValues.review_id}`, JSON.stringify(data), (err, reply) => {
            if (err) {
                console.error('Error while adding trail review into redis cache !', err);
                return;
            }
        });
        req.flash("success", `Thank you for leaving a review`);
        return res.redirect(`/trails/${trail_id}`);
    }).catch(err => {
        return next(err);
    });
});
exports.addReview = addReview;
