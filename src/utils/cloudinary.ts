import { cloudinary } from "../config/cloudinary.ts";
import { ApiError } from "./apiError.ts";

export const cloudinaryUploadImage = async (imagePath: string) => {

   try {

    const { secure_url, public_id } = await cloudinary.uploader.upload(imagePath, {
        resource_type: "image"
    })

    return { secure_url, public_id }

   } catch (error) {
        return new ApiError("Uploading went wrong", 400);
   }

}

export const cloudinaryDeleteImage = async (public_id: string) => {

    try {
        
        await cloudinary.uploader.destroy(public_id);

    } catch (error) {
        return new ApiError("Remove image went wrong", 400);
    }
}

export const cloudinaryDeleteImages = async (public_ids: string[]) => {

    try {
        
        await cloudinary.api.delete_resources(public_ids);

    } catch (error) {
        return new ApiError("Remove images went wrong", 400);
    }
}


