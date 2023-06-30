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
Object.defineProperty(exports, "__esModule", { value: true });
exports.addReview = void 0;
const myModels = __importStar(require("../../models/index"));
const addReview = (req, res) => {
    const { review_text, review_rating } = req.body;
    const author_id = req.session.active_user_id;
    const { trail_id } = req.params;
    if (!review_text.length) {
        req.flash("danger", `Review cannot be blank !`);
        return res.redirect(`/trails/${trail_id}`);
    }
    //no need to await the operation the user cannot see the effect behind the scenes
    const newReview = myModels.Review.create({ review_text: review_text, review_rating: review_rating, author_id: author_id, trail_id: trail_id });
    newReview.then(data => {
        req.flash("success", `Thank you for leaving a review`);
        return res.redirect(`/trails/${trail_id}`);
    }).catch(err => {
        return res.send("error set to " + err);
    });
};
exports.addReview = addReview;
