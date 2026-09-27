import type { UserDocument } from "./user.type.ts";

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
    }
  }
}

export {};