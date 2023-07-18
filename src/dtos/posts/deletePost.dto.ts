import z from "zod";
import { PostModel } from "../../models/Posts";

export interface DeletePostInputDTO {
  idToDelete: string;
  token: string;
}
export interface DeletePostOutputDTO {
  message: string;
}

export const DeletePostSchema = z
  .object({
    idToDelete: z.string().min(1),
    token: z.string().min(1),
  })
  .transform((data) => data as DeletePostInputDTO);
