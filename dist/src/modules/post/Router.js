"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PostController_1 = __importDefault(require("./PostController"));
const PostService_1 = __importDefault(require("../../services/PostService"));
const PostRouter = (0, express_1.Router)();
const postSvc = new PostService_1.default();
const postCtlr = new PostController_1.default(postSvc);
PostRouter.route("/feed").all(postCtlr.getPostFeed);
exports.default = PostRouter;
//# sourceMappingURL=Router.js.map