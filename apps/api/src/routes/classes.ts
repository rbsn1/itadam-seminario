import { Router } from "express";
import { z } from "zod";
import { prisma } from "../utils/prisma.js";
import { authenticate } from "../middleware/auth.js";
import { authorize } from "../middleware/rbac.js";
import { audit } from "../middleware/audit.js";
import { Role } from "@prisma/client";

export const classesRouter = Router();

const classSchema = z.object({
  name: z.string().min(2),
  year: z.number().int()
});

classesRouter.use(authenticate);

classesRouter.get("/", authorize([Role.ADMIN, Role.SECRETARIA, Role.PEDAGOGIA, Role.TESOURARIA, Role.PROFESSOR]), async (_req, res) => {
  const classes = await prisma.class.findMany({ orderBy: { createdAt: "desc" } });
  return res.json(classes);
});

classesRouter.post("/", authorize([Role.ADMIN, Role.SECRETARIA]), audit("create", "class"), async (req, res) => {
  const result = classSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ message: "Invalid payload", errors: result.error.flatten() });
  }
  const classroom = await prisma.class.create({ data: result.data });
  return res.status(201).json(classroom);
});

classesRouter.put("/:id", authorize([Role.ADMIN, Role.SECRETARIA]), audit("update", "class"), async (req, res) => {
  const result = classSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ message: "Invalid payload", errors: result.error.flatten() });
  }
  const classroom = await prisma.class.update({ where: { id: req.params.id }, data: result.data });
  return res.json(classroom);
});

classesRouter.delete("/:id", authorize([Role.ADMIN, Role.SECRETARIA]), audit("delete", "class"), async (req, res) => {
  await prisma.class.delete({ where: { id: req.params.id } });
  return res.status(204).send();
});
