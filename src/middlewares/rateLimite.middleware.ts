import rateLimit from "express-rate-limit";

export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20, // Limit each IP to 100 requests per window
    standardHeaders: 'draft-7', 
    legacyHeaders: false, 
    message: {
        status: 429,
        message: "Too many requests , please try again after 15 minutes."
    }
})
