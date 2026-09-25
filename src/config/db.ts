import mongoose from "mongoose";

export async function connectDB() {
    const conn = await mongoose.connect(process.env.MONGO_URI!);
    console.log(`Database connected on ${conn.connection.host}`);
}

export async function disconnectDB() {
    await mongoose.disconnect();
}
