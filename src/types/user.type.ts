import { Document } from "mongoose";

interface IUser {
    id?: string;
    username: string;
    email: string;
    password: string;
    image?: {
        url: string,
        publicId: string
    };
    bio?: string;
    isAdmin?: boolean,
    isAccountVerified?: boolean;
}

interface IUserMethods {
    matchPassword:(password: string) => Promise<boolean>; 
}

type UserDocument = IUser & IUserMethods & Document;

export type { IUser, IUserMethods, UserDocument }
