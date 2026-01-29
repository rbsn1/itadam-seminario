import { Router } from "express";
import { z } from "zod";
import { prisma } from "../utils/prisma.js";
import { authenticate } from "../middleware/auth.js";
import { authorize } from "../middleware/rbac.js";
import { authService } from "../services/auth.js";
import { Role } from "@prisma/client";

export const usersRouter = Router();

usersRouter.use(authenticate);

usersRouter.get("/", authorize([Role.ADMIN]), async (_req, res) => {
  const users = await prisma.user.findMany({ select: { id: true, name: true, email: true, role: true } });
  return res.json(users);
});

usersRouter.post("/", authorize([Role.ADMIN]), async (req, res) => {
  const result = z
    .object({ name: z.string().min(2), email: z.string().email(), role: z.nativeEnum(Role), password: z.string().min(6) })
    .safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ message: "Invalid payload", errors: result.error.flatten() });
  }
  const password = await authService.hashPassword(result.data.password);
  const user = await prisma.user.create({ data: { ...result.data, password } });
  return res.status(201).json({ id: user.id, name: user.name, email: user.email, role: user.role });
});
