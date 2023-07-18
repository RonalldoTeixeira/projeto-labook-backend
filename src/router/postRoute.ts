import express from "express";
import { PostController } from "../controller/PostController";
import { PostBusiness } from "../business/PostBusiness";
import { PostDataBase } from "../database/PostDataBase";
import { IdGenerator } from "../services/IdGenerator";

import { TokenManager } from "../services/TokenManager";

export const postRoute = express.Router();

const postController = new PostController(
  new PostBusiness(
    new PostDataBase(), 
    new IdGenerator(),
    new TokenManager())
);
postRoute.get("/", postController.getAllPosts);
postRoute.post("/", postController.createPost);
postRoute.put("/:id", postController.updatePost);
postRoute.delete("/:id", postController.deletePost);
postRoute.put("/:id/like", postController.LikeDislikePost);
