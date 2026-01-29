import { Router } from "express";
import { z } from "zod";
import { prisma } from "../utils/prisma.js";
import { authenticate } from "../middleware/auth.js";
import { authorize } from "../middleware/rbac.js";
import { audit } from "../middleware/audit.js";
import { Role } from "@prisma/client";

export const modulesRouter = Router();

const moduleSchema = z.object({
  name: z.string().min(2)
});

modulesRouter.use(authenticate);

modulesRouter.get("/", authorize([Role.ADMIN, Role.PEDAGOGIA]), async (_req, res) => {
  const modules = await prisma.module.findMany({ orderBy: { createdAt: "desc" } });
  return res.json(modules);
});

modulesRouter.post("/", authorize([Role.ADMIN, Role.PEDAGOGIA]), audit("create", "module"), async (req, res) => {
  const result = moduleSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ message: "Invalid payload", errors: result.error.flatten() });
  }
  const module = await prisma.module.create({ data: result.data });
  return res.status(201).json(module);
});

modulesRouter.post("/assign", authorize([Role.ADMIN, Role.PEDAGOGIA]), audit("create", "class_module"), async (req, res) => {
  const result = z
    .object({ classId: z.string().uuid(), moduleId: z.string().uuid() })
    .safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ message: "Invalid payload", errors: result.error.flatten() });
  }
  const classModule = await prisma.classModule.create({ data: result.data });
  return res.status(201).json(classModule);
});
