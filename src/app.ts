import express, { type Express } from "express";
import cors from "cors";
import { errorMiddleware, notFound } from "./middlewares/error.middleware.ts";

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use("/", (req, res, next)=> {
//     res.json({message: "ok"});
// })

// Error middlewares
app.use(notFound);
app.use(errorMiddleware);


export { app }

