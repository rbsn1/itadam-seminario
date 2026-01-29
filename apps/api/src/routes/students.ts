import { Router } from "express";
import { z } from "zod";
import { prisma } from "../utils/prisma.js";
import { authorize } from "../middleware/rbac.js";
import { authenticate, AuthRequest } from "../middleware/auth.js";
import { audit } from "../middleware/audit.js";
import { Role } from "@prisma/client";

export const studentsRouter = Router();

const studentSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional().nullable(),
  document: z.string().optional().nullable(),
  phone: z.string().optional().nullable()
});

studentsRouter.use(authenticate);

studentsRouter.get("/", authorize([Role.ADMIN, Role.SECRETARIA, Role.PEDAGOGIA, Role.TESOURARIA]), async (req, res) => {
  const page = Number(req.query.page ?? 1);
  const pageSize = Number(req.query.pageSize ?? 10);
  const search = String(req.query.search ?? "");

  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { document: { contains: search, mode: "insensitive" } }
        ]
      }
    : undefined;

  const [total, items] = await Promise.all([
    prisma.student.count({ where }),
    prisma.student.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" }
    })
  ]);

  return res.json({ total, page, pageSize, items });
});

studentsRouter.post("/", authorize([Role.ADMIN, Role.SECRETARIA]), audit("create", "student"), async (req: AuthRequest, res) => {
  const result = studentSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ message: "Invalid payload", errors: result.error.flatten() });
  }
  const student = await prisma.student.create({ data: result.data });
  return res.status(201).json(student);
});

studentsRouter.get("/:id", authorize([Role.ADMIN, Role.SECRETARIA, Role.PEDAGOGIA, Role.TESOURARIA]), async (req, res) => {
  const student = await prisma.student.findUnique({
    where: { id: req.params.id },
    include: {
      enrollments: { include: { class: true } },
      documents: true,
      charges: { include: { payments: true } },
      attendance: { include: { lesson: { include: { module: true } } } }
    }
  });
  if (!student) {
    return res.status(404).json({ message: "Not found" });
  }
  return res.json(student);
});

studentsRouter.put("/:id", authorize([Role.ADMIN, Role.SECRETARIA]), audit("update", "student"), async (req, res) => {
  const result = studentSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ message: "Invalid payload", errors: result.error.flatten() });
  }
  const student = await prisma.student.update({ where: { id: req.params.id }, data: result.data });
  return res.json(student);
});

studentsRouter.delete("/:id", authorize([Role.ADMIN, Role.SECRETARIA]), audit("delete", "student"), async (req, res) => {
  await prisma.student.delete({ where: { id: req.params.id } });
  return res.status(204).send();
});
