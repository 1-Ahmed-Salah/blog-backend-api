
export interface IUser {
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

export interface IUserMethods {
    matchPassword:(password: string) => Promise<boolean>; 
}

