import z from "zod";

export interface CreatePostInputDTO {
  token: string; 
  content: string;
}

export interface CreatePostOutputDTO {
  message: string;
  post: {
    id: string;
    content: string;
    createdAt: string;
    likes: number;
    creator:{
     id:string,
     name: string
    }
  };
}

export const CreatePostSchema = z
  .object({
    token: z.string().min(1),  
    content: z.string().min(4),
  })
  .transform((data) => data as CreatePostInputDTO);
