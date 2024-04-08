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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReview = void 0;
const myModels = __importStar(require("../../models/index"));
const deleteReview = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { review_id, trail_id } = req.params;
    const allReviews = yield myModels.Review.findAll({ where: { review_id: review_id } });
    if (!allReviews.length || allReviews.length != 1) {
        req.flash("danger", `no review found with given data`);
        return res.redirect(`/trails/${trail_id}`);
    }
    if (allReviews[0].dataValues.author_id != req.session.active_user_id) {
        req.flash("danger", `not authorized to delete this review !`);
        return res.status(401).redirect(`/trails/${trail_id}`);
    }
    const review = myModels.Review.destroy({ where: { review_id: review_id } })
        .then(data => {
        req.flash("success", ` review successfuly deleted.`);
        return res.redirect(`/trails/${trail_id}`);
    }).catch(err => {
        return next(err);
    });
});
exports.deleteReview = deleteReview;
