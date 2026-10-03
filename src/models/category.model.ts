import { Schema, model } from "mongoose";

const CategorySchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    }

}, { timestamps: true });

export default model("Categorie", CategorySchema);
