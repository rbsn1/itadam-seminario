import { NextFunction, Response } from "express";
import { prisma } from "../utils/prisma.js";
import { AuthRequest } from "./auth.js";

export function audit(action: string, entity: string) {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    res.on("finish", async () => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        await prisma.auditLog.create({
          data: {
            action,
            entity,
            entityId: req.params.id,
            userId: req.user?.id,
            metadata: { path: req.path, method: req.method }
          }
        });
      }
    });
    next();
  };
}
