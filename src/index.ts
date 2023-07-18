import express from "express";
import cors from "cors";
import { postRoute } from "./router/postRoute";
import dotenv from "dotenv";
import { userRoute } from "./router/userRoute";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.listen(Number(process.env.PORT) || 3003, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT || 3003}`);
});
app.use("/posts", postRoute);
app.use("/users", userRoute);
