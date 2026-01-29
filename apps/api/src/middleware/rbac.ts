import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.js";
import { Role } from "@prisma/client";

export function authorize(allowed: Role[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!allowed.includes(req.user.role as Role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    return next();
  };
}
