import { Schema, model } from "mongoose";

const UserSchema = new Schema({
    username: {
        type: String,
        trim: true,
        required: true,
        minLength: 2,
        maxLength: 20
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        minLength: 2,
        maxLength: 50
    },
    password: {
        type: String,
        trim: true,
        required: true,
        minLength: 6
    },
    image: {
        type: Object,
        default: {
            url: 'avatar.png',
            publicId: null
        }
    },
    bio: String,
    isAdmin: {
        type: Boolean,
        default: false
    },
    isAccountVerified: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export default model("User", UserSchema);

