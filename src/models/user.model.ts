import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

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
    bio: {
        type: String,
        trim: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isAccountVerified: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

UserSchema.pre('save', async function() {
    if(!this.isModified('password')) {
        return;
    }

    const salt = await bcrypt.genSalt(+process.env.HASH_SALT!);
    this.password = await bcrypt.hash(this.password, salt);
})

UserSchema.methods.matchPassword = async function(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
}

export default model("User", UserSchema);
