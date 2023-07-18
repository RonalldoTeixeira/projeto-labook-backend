export class LikesDislikes {
  constructor(userId: string, postId: string, like: number) {}
}
export interface LikesDislikesDB {
  user_id: string;
  post_id: string;
  like: number;
}
export enum POST_LIKE {
  ALREADY_LIKED = "ALREADY LIKED",
  ALREADY_DISLIKED = "ALREADY DISLIKED"
}