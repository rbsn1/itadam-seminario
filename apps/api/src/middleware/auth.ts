import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.js";
import { prisma } from "../utils/prisma.js";

export type AuthRequest = Request & { user?: { id: string; role: string } };

export async function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing token" });
  }

  try {
    const token = header.replace("Bearer ", "");
    const payload = authService.verifyAccessToken(token);
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.user = { id: user.id, role: user.role };
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
}
