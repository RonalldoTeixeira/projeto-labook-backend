import { IdGenerator } from "./../services/IdGenerator";
import { PostDataBase } from "../database/PostDataBase";
import {
  CreatePostInputDTO,
  CreatePostOutputDTO,
} from "../dtos/posts/createPost.dto";
import { Posts } from "../models/Posts";
import { BadRequestError } from "../errors/BadRequestError";
import { GetPostInputDTO, GetPostsOutputDTO } from "../dtos/posts/getPosts.dto";
import {
  DeletePostInputDTO,
  DeletePostOutputDTO,
} from "../dtos/posts/deletePost.dto";

import { LikesDislikesDB } from "../models/LikesDislikes";
import {
  LikesDislikesInputDTO,
  LikesDislikesOutputDTO,
} from "../dtos/likesDislikes/likes-dislikes.dto";
import {
  UpdatePostInputDTO,
  UpdatePostOutputDTO,
} from "../dtos/posts/updatePost.dto";
import { TokenManager } from "../services/TokenManager";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { NotFoundError } from "../errors/NotFoundError";
import { ForbiddenError } from "../errors/ForbiddenError";
import { USER_ROLES } from "../models/User";
import { POST_LIKE } from "../models/LikesDislikes";

export class PostBusiness {

  constructor(
    private postDataBase: PostDataBase,
    private idGenerator: IdGenerator, 
    private tokenManager: TokenManager
  ) {}

  
  public getAllPosts = async (
    input: GetPostInputDTO
  ): Promise<GetPostsOutputDTO> => {
  
    const { token } = input;


    const payload = await this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError();
    }

    const postDB = await this.postDataBase.getAllPosts();

    const findPosts = postDB.map((post) => {
      const posts = new Posts(
        post.id,
        post.content,
        post.created_at,
        post.updated_at,
        post.likes,
        post.dislikes,
        post.creator_id,
        post.creator_name
      );
      return posts.toBusinessModel();
    });

    const output: GetPostsOutputDTO = findPosts;
    return output;
  };


  public createPost = async (
    input: CreatePostInputDTO
  ): Promise<CreatePostOutputDTO> => {

    const { token, content } = input;


    const payload = await this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError();
    }

    const id = this.idGenerator.generate();

    const postExist = await this.postDataBase.findPostById(id);
    if (postExist) {
      throw new BadRequestError("'id' já existe");
    }

    const newPost = new Posts(
      id,
      content,
      new Date().toLocaleString(), 
      new Date().toLocaleString(), 
      0, 
      0, 
      payload.id,
      payload.name
    );

    
    const newPostDB = newPost.toDBModel();
    await this.postDataBase.insertPost(newPostDB);

    

    const output: CreatePostOutputDTO = {
      message: "Post criado com sucesso!",
      post: newPost.toBusinessModel(),
    };
    return output;
  };

  
  public updatePost = async (
    input: UpdatePostInputDTO
  ): Promise<UpdatePostOutputDTO> => {
    const { token, idPostToEdit, content } = input;

 
    const payload = await this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError();
    }
  
    const postExist = await this.postDataBase.findPostById(idPostToEdit);
    if (!postExist) {
      throw new NotFoundError("'id' não encontrado.");
    }
   
    if (payload.id !== postExist.creator_id) {
      throw new ForbiddenError("somente quem criou o Post pode editá-lo");
    }

    //instânciar novo post
    const newPost = new Posts(
      postExist.id,
      postExist.content,
      postExist.created_at,
      postExist.updated_at,
      postExist.likes,
      postExist.dislikes,
      payload.id,
      payload.name
    );
    newPost.setContent(content);
   
    newPost.setUpdatedAt(new Date().toLocaleString());

    const updatedNewPost = newPost.toDBModel();

   
    await this.postDataBase.updatePost(idPostToEdit, updatedNewPost);
  
    const output: UpdatePostOutputDTO = {
      message: "Post Atualizado com sucesso!",
      post: newPost.toBusinessModel(),
    };
    return output;
  };

  public deletePost = async (
    input: DeletePostInputDTO
  ): Promise<DeletePostOutputDTO> => {
    const { idToDelete, token } = input;
   
    const payload = await this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError();
    }
    
    const postExist = await this.postDataBase.findPostById(idToDelete);
    if (!postExist) {
      throw new NotFoundError("'id' não encontrado.");
    }

    
    if (payload.role !== USER_ROLES.ADMIN) {
      if (payload.id !== postExist.creator_id) {
        throw new ForbiddenError(
          "somente quem criou o Post ou administrador pode deleta-lo"
        );
      }
    }

    
    await this.postDataBase.deletePost(idToDelete);
    
    const output: DeletePostOutputDTO = {
      message: "Post deletado!",
    };
    return output;
  };

  

  public likeDislikePost = async (
    input: LikesDislikesInputDTO
  ): Promise<LikesDislikesOutputDTO> => {
    const { token, like, postId } = input;
    
    
    const payload = await this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError();
    }

    const postExist = await this.postDataBase.findPostWithPostId(postId);

    if (!postExist) {
      throw new NotFoundError("'id' não encontrado.");
    }
    
    const newPost = new Posts(
      postExist.id,
      postExist.content,
      postExist.created_at,
      postExist.updated_at,
      postExist.likes,
      postExist.dislikes,
      payload.id,
      payload.name
    );

    
    const likeDB = like ? 1 : 0;

    const likeDislikeDB: LikesDislikesDB = {
      user_id: payload.id,
      post_id: postId,
      like: likeDB,
    };

  
    const LikeDislikesExists = await this.postDataBase.findLikeDislike(
      likeDislikeDB
    );
  
    if (LikeDislikesExists === POST_LIKE.ALREADY_LIKED) {
    
      if (like) {
        await this.postDataBase.deleteLikeDislike(likeDislikeDB);
        newPost.removeLike();
      } else {
        
        await this.postDataBase.updateLikeDislike(likeDislikeDB); 
        newPost.removeLike(); 
        newPost.addDislike(); 
      }
      // Se dislike for checked
    } else if (LikeDislikesExists === POST_LIKE.ALREADY_DISLIKED) {
      
      if (like === false) {
        
        await this.postDataBase.deleteLikeDislike(likeDislikeDB);
        newPost.removeDislike(); //decrementa o like.
      }
     
      else {
        await this.postDataBase.updateLikeDislike(likeDislikeDB); 
        newPost.removeDislike();
        newPost.addLike(); 
      }
    }
    
    else {
      await this.postDataBase.insertLikeDislike(likeDislikeDB); 
     
      like ? newPost.addLike() : newPost.addDislike();
    }

   
    const updatedNewPost = newPost.toDBModel();
   
    await this.postDataBase.updatePost(postId, updatedNewPost);
    
    const output: LikesDislikesOutputDTO = undefined;
    return output;
  };
}
