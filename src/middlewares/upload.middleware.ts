import multer from "multer";
import { ApiError } from "../utils/apiError.ts";

const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, "src/uploads");
    },
    filename(req, file, callback) {
        callback(null, `user-${Date.now()}-${file.originalname}`);
    },
});

export const upload = multer({ 
    storage, 
    fileFilter(req, file, callback) {
        if(file.mimetype.startsWith('image')){
            callback(null, true);
        } else {
            callback(new ApiError("must upload only an image", 400));
        }
    },
    limits: {fieldSize: 1024 * 1024}
})
