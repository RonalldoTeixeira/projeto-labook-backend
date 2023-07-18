import z from "zod"
import { PostModel } from "../../models/Posts"

export interface GetPostInputDTO {
  token: string
}
export type GetPostsOutputDTO = PostModel[]

export const GetPostSchema = z.object({
 token: z.string().min(10)
}).transform(data => data as GetPostInputDTO)