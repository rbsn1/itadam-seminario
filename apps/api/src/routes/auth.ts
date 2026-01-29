import { Router } from "express";
import { z } from "zod";
import { prisma } from "../utils/prisma.js";
import { authService } from "../services/auth.js";
import { authenticate, AuthRequest } from "../middleware/auth.js";

export const authRouter = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

authRouter.post("/login", async (req, res) => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ message: "Invalid payload", errors: result.error.flatten() });
  }

  const user = await prisma.user.findUnique({ where: { email: result.data.email } });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const valid = await authService.comparePassword(result.data.password, user.password);
  if (!valid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  return res.json(authService.toAuthResponse({ id: user.id, email: user.email, name: user.name, role: user.role }));
});

authRouter.post("/refresh", async (req, res) => {
  const token = req.body?.refreshToken as string | undefined;
  if (!token) {
    return res.status(400).json({ message: "Missing refresh token" });
  }
  try {
    const payload = authService.verifyRefreshToken(token);
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }
    return res.json(authService.toAuthResponse({ id: user.id, email: user.email, name: user.name, role: user.role }));
  } catch (error) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
});

authRouter.get("/me", authenticate, async (req: AuthRequest, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const user = await prisma.user.findUnique({ where: { id: req.user.id }, select: { id: true, name: true, email: true, role: true } });
  return res.json(user);
});
