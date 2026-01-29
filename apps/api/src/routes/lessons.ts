import { Router } from "express";
import { z } from "zod";
import { prisma } from "../utils/prisma.js";
import { authenticate, AuthRequest } from "../middleware/auth.js";
import { authorize } from "../middleware/rbac.js";
import { audit } from "../middleware/audit.js";
import { AttendanceStatus, Role } from "@prisma/client";

export const lessonsRouter = Router();

const lessonSchema = z.object({
  classId: z.string().uuid(),
  moduleId: z.string().uuid(),
  date: z.string().datetime(),
  notes: z.string().optional().nullable()
});

lessonsRouter.use(authenticate);

lessonsRouter.post("/", authorize([Role.ADMIN, Role.PEDAGOGIA]), audit("create", "lesson"), async (req, res) => {
  const result = lessonSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ message: "Invalid payload", errors: result.error.flatten() });
  }
  const lesson = await prisma.lesson.create({
    data: {
      classId: result.data.classId,
      moduleId: result.data.moduleId,
      date: new Date(result.data.date),
      notes: result.data.notes ?? null
    }
  });
  return res.status(201).json(lesson);
});

lessonsRouter.post("/:id/attendance", authorize([Role.ADMIN, Role.PEDAGOGIA, Role.PROFESSOR]), audit("create", "attendance"), async (req: AuthRequest, res) => {
  const result = z
    .object({ studentId: z.string().uuid(), status: z.nativeEnum(AttendanceStatus), justification: z.string().optional().nullable() })
    .safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ message: "Invalid payload", errors: result.error.flatten() });
  }
  const lesson = await prisma.lesson.findUnique({ where: { id: req.params.id } });
  if (!lesson) {
    return res.status(404).json({ message: "Lesson not found" });
  }

  if (req.user?.role === Role.PROFESSOR) {
    const assignment = await prisma.teacherAssignment.findFirst({
      where: { teacherId: req.user.id, classId: lesson.classId, moduleId: lesson.moduleId }
    });
    if (!assignment) {
      return res.status(403).json({ message: "Professor not assigned to this lesson" });
    }
  }

  const attendance = await prisma.attendance.upsert({
    where: { lessonId_studentId: { lessonId: req.params.id, studentId: result.data.studentId } },
    update: { status: result.data.status, justification: result.data.justification ?? null },
    create: {
      lessonId: req.params.id,
      studentId: result.data.studentId,
      status: result.data.status,
      justification: result.data.justification ?? null
    }
  });
  return res.status(201).json(attendance);
});
