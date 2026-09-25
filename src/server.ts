import "dotenv/config";
import { app } from "./app";
import { createServer } from "node:http";
import { connectDB, disconnectDB } from "./config/db";


async function bootstrab() {

    await connectDB();

    const PORT = process.env.PORT || 5001;

    const server = createServer(app);
    server.listen(PORT, ()=> console.log(`server is running on port ${PORT}`));

    // Handle global errors
    process.on("unhandledRejection", (reason: Error)=> {
        console.log(`Unhandled Rejection: ${reason.message}`);
        server.close(async ()=> {
            console.log(`Shutting down...`);
            await disconnectDB();
            process.exit(1);
        })
    })
}

bootstrab();
