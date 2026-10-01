import { Schema, model } from "mongoose";
import { ref } from "node:process";

const PostSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minLength: 2,
        maxLength: 100
    },
    description: {
        type: String,
        required: true,
        trim: true,
        minLength: 10,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    category: {
        type: String,
        required: true
    },
    image: {
        type: Object,
        default: {
            url: "",
            publicId: null
        }
    },
    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        }
    ]
}, { timestamps: true });

export default model("Post", PostSchema);
