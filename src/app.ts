/**
 * @desc    Core and third party modules
 */
import path from "node:path";
import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import { xss } from "express-xss-sanitizer"

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
import CategoryRoute from "./routes/category.route.ts";

const app: Express = express();

app.use(helmet())
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(xss())

// Routes
app.use('/health', (req, res)=> {
    res.status(200).json({
        message: "ok"
    })
})
app.use('/api/v1/auth', AuthRoute);
app.use('/api/v1/users', UsersRoute);
app.use('/api/v1/posts', PostRoute);
app.use('/api/v1/comments', CommentRoute);
app.use('/api/v1/categories', CategoryRoute);
app.use('/api/v1/uploads', express.static(path.join(import.meta.dirname, "uploads")));

// Error middlewares
app.use(notFound);
app.use(errorMiddleware);


export { app }

