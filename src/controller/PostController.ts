import { PostDataBase } from "./../database/PostDataBase";
import { PostBusiness } from "../business/PostBusiness";
import { Request, Response } from "express";
import { BaseError } from "../errors/BaseError";
import { CreatePostSchema } from "../dtos/posts/createPost.dto";
import { GetPostSchema } from "../dtos/posts/getPosts.dto";
import { DeletePostSchema } from "../dtos/posts/deletePost.dto";
import { UpdaterPostSchema } from "../dtos/posts/updatePost.dto";
import { ZodError } from "zod";
import { LikeDislikePSchema } from "../dtos/likesDislikes/likes-dislikes.dto";

export class PostController {
 
  constructor(private postBusiness: PostBusiness) {}


  public getAllPosts = async (req: Request, res: Response) => {
    try {
      
      const input = GetPostSchema.parse({
        token: req.headers.authorization,
      });


      const output = await this.postBusiness.getAllPosts(input);

      
      res.status(200).send(output);
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro Inesperado");
      }
    }
  };
 
  public createPost = async (req: Request, res: Response) => {
    try {
      
      const input = CreatePostSchema.parse({
        token: req.headers.authorization,
        content: req.body.content,
      });

      
      const output = await this.postBusiness.createPost(input);
    
      res.status(201).send(output);
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  };

  public updatePost = async (req: Request, res: Response) => {
    try {
      
      const input = UpdaterPostSchema.parse({
        token: req.headers.authorization,
        idPostToEdit: req.params.id,
        content: req.body.content,
      });
     
      const output = await this.postBusiness.updatePost(input);

  
      res.status(200).send(output);
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro Inesperado");
      }
    }
  };

 
  public deletePost = async (req: Request, res: Response) => {
    try {
     
      const input = DeletePostSchema.parse({
        token: req.headers.authorization,
        idToDelete: req.params.id,
      });

      const output = await this.postBusiness.deletePost(input);

  
      res.status(200).send(output);
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  };

  public LikeDislikePost = async (req: Request, res: Response) => {
    try {
      
      const input = LikeDislikePSchema.parse({
        postId: req.params.id,
        token: req.headers.authorization,
        like: req.body.like,
      });

   
      const output = await this.postBusiness.likeDislikePost(input);

     
      res.status(200).send(output);
    } catch (error) {
      console.log(error);
      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  };
}
