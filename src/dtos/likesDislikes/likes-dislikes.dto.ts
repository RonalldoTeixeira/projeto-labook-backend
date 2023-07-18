import z from "zod";

export interface LikesDislikesInputDTO {
  postId: string;
  token: string;
  like: boolean;
}
export type LikesDislikesOutputDTO = undefined;
export const LikeDislikePSchema = z
  .object({
    postId: z.string().min(1),
    token: z.string().min(1),
    like: z.boolean(),
  })
  .transform((data) => data as LikesDislikesInputDTO);
