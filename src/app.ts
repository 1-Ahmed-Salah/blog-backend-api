/**
 * @desc    Core and third party modules
 */
import express, { type Express } from "express";
import cors from "cors";

/**
 * @desc    Custom modules and middlewares
 */
import { errorMiddleware, notFound } from "./middlewares/error.middleware.ts";

/**
 * @desc    Routes
 */
import AuthRoute from "./routes/auth.route.ts";

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1/auth', AuthRoute);

// Error middlewares
app.use(notFound);
app.use(errorMiddleware);


export { app }

