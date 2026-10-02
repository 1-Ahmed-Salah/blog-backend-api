/**
 * @desc    Core and third party modules
 */
import express, { type Express } from "express";
import path from "node:path";
import cors from "cors";

/**
 * @desc    Custom modules and middlewares
 */
import { errorMiddleware, notFound } from "./middlewares/error.middleware.ts";

/**
 * @desc    Routes
 */
import AuthRoute from "./routes/auth.route.ts";
import UsersRoute from "./routes/user.route.ts";
import PostRoute from "./routes/post.route.ts";
import CommentRoute from "./routes/comment.route.ts";

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1/auth', AuthRoute);
app.use('/api/v1/users', UsersRoute);
app.use('/api/v1/posts', PostRoute);
app.use('/api/v1/comments', CommentRoute);
app.use('/api/v1/uploads', express.static(path.join(import.meta.dirname, "uploads")));

// Error middlewares
app.use(notFound);
app.use(errorMiddleware);


export { app }

