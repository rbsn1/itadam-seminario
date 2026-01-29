import { Router } from "express";
import { z } from "zod";
import { prisma } from "../utils/prisma.js";
import { authenticate } from "../middleware/auth.js";
import { authorize } from "../middleware/rbac.js";
import { audit } from "../middleware/audit.js";
import { Role } from "@prisma/client";

export const enrollmentsRouter = Router();

const enrollSchema = z.object({
  studentId: z.string().uuid(),
  classId: z.string().uuid(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional().nullable()
});

enrollmentsRouter.use(authenticate);

enrollmentsRouter.post("/", authorize([Role.ADMIN, Role.SECRETARIA]), audit("create", "enrollment"), async (req, res) => {
  const result = enrollSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ message: "Invalid payload", errors: result.error.flatten() });
  }

  const enrollment = await prisma.enrollment.create({
    data: {
      studentId: result.data.studentId,
      classId: result.data.classId,
      startDate: result.data.startDate ? new Date(result.data.startDate) : undefined,
      endDate: result.data.endDate ? new Date(result.data.endDate) : null
    }
  });
  return res.status(201).json(enrollment);
});

