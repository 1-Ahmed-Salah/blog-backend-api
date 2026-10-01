import { cloudinary } from "../config/cloudinary.ts";

export const cloudinaryUploadImage = async (imagePath: string) => {

   try {

    const { secure_url, public_id } = await cloudinary.uploader.upload(imagePath, {
        resource_type: "image"
    })

    return { secure_url, public_id }

   } catch (error) {
        throw new Error("Uploading went wrong");
   }

}

export const cloudinaryDeleteImage = async (public_id: string) => {

    try {
        
        await cloudinary.uploader.destroy(public_id);

    } catch (error) {
        throw new Error("Remove image went wrong");
    }
}



