import { LikesDislikesDB, POST_LIKE } from "../models/LikesDislikes";
import { PostDB, PostDBWithCreatorName } from "./../models/Posts";
import { BaseDataBase } from "./BaseDataBase";
import { UserDataBase } from "./UserDataBase";

export class PostDataBase extends BaseDataBase {
  
  private static TABLE_POSTS = "posts";
  private static TABLE_LIKE_DISLIKE = "likes_dislikes";
 
  public getAllPosts = async (): Promise<PostDBWithCreatorName[]> => {
    const result = await BaseDataBase.connection(PostDataBase.TABLE_POSTS)
      .select(
        `${PostDataBase.TABLE_POSTS}.id `,
        `${PostDataBase.TABLE_POSTS}.creator_id`,
        `${PostDataBase.TABLE_POSTS}.content`,
        `${PostDataBase.TABLE_POSTS}.created_at`,
        `${PostDataBase.TABLE_POSTS}.updated_at`,
        `${PostDataBase.TABLE_POSTS}.likes`,
        `${PostDataBase.TABLE_POSTS}.dislikes`,
        `${UserDataBase.TABLE_USERS}.name as creator_name`
      )
      .join(
        `${UserDataBase.TABLE_USERS}`,
        `${PostDataBase.TABLE_POSTS}.creator_id`,
        "=",
        `${UserDataBase.TABLE_USERS}.id`
      );

    return result;
  };
  
  public async findPostById(id: string): Promise<PostDB | undefined> {
    const [postDB]: PostDB[] | undefined[] = await BaseDataBase.connection(
      PostDataBase.TABLE_POSTS
    ).where({ id });

    return postDB;
  }
  
  public insertPost = async (newPost: PostDB): Promise<PostDB> => {
    return await BaseDataBase.connection(PostDataBase.TABLE_POSTS).insert(
      newPost
    );
  };


  public async updatePost(idToEdit: string, postDB: PostDB) {
    await BaseDataBase.connection(PostDataBase.TABLE_POSTS)
      .update(postDB)
      .where({ id: idToEdit });
  }


  public async deletePost(idToDelete: string) {
    await BaseDataBase.connection(PostDataBase.TABLE_POSTS)
      .delete()
      .where({ id: idToDelete });
  }

 
  public findPostWithPostId = async (
    id: string
  ): Promise<PostDBWithCreatorName | undefined> => {
    const [result] = await BaseDataBase.connection(PostDataBase.TABLE_POSTS)
      .select(
        `${PostDataBase.TABLE_POSTS}.id `,
        `${PostDataBase.TABLE_POSTS}.creator_id`,
        `${PostDataBase.TABLE_POSTS}.content`,
        `${PostDataBase.TABLE_POSTS}.created_at`,
        `${PostDataBase.TABLE_POSTS}.updated_at`,
        `${PostDataBase.TABLE_POSTS}.likes`,
        `${PostDataBase.TABLE_POSTS}.dislikes`,
        `${UserDataBase.TABLE_USERS}.name as creator_name`
      )
      .join(
        `${UserDataBase.TABLE_USERS}`,
        `${PostDataBase.TABLE_POSTS}.creator_id`,
        "=",
        `${UserDataBase.TABLE_USERS}.id`
      )
      .where({ [`${PostDataBase.TABLE_POSTS}.id`]: id });

    return result as PostDBWithCreatorName | undefined;
  };


  public async findLikeDislike(
    likeDislikeDB: LikesDislikesDB
  ): Promise<POST_LIKE | undefined> {
    const [result] = await BaseDataBase.connection(
      PostDataBase.TABLE_LIKE_DISLIKE
    )
      .select()
      .where({
        user_id: likeDislikeDB.user_id,
        post_id: likeDislikeDB.post_id,
      });
    if (result === undefined) {
      return undefined;
    } else if (result.like === 1) {
      return POST_LIKE.ALREADY_LIKED;
    } else {
      return POST_LIKE.ALREADY_DISLIKED;
    }
  }
  public async deleteLikeDislike(
    likeDislikeDB: LikesDislikesDB
  ): Promise<void> {
    await BaseDataBase.connection(PostDataBase.TABLE_LIKE_DISLIKE)
      .delete()
      .where({
        user_id: likeDislikeDB.user_id,
        post_id: likeDislikeDB.post_id,
      });
  }
  public async updateLikeDislike(
    likeDislikeDB: LikesDislikesDB
  ): Promise<void> {
    await BaseDataBase.connection(PostDataBase.TABLE_LIKE_DISLIKE)
      .update(likeDislikeDB)
      .where({
        user_id: likeDislikeDB.user_id,
        post_id: likeDislikeDB.post_id,
      });
  }
  public async insertLikeDislike(
    likeDislikeDB: LikesDislikesDB
  ): Promise<void> {
    await BaseDataBase.connection(PostDataBase.TABLE_LIKE_DISLIKE).insert(
      likeDislikeDB
    );
  }
}
