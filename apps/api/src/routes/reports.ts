import { Router } from "express";
import { prisma } from "../utils/prisma.js";
import { authenticate } from "../middleware/auth.js";
import { authorize } from "../middleware/rbac.js";
import { Role } from "@prisma/client";

export const reportsRouter = Router();

reportsRouter.use(authenticate);

reportsRouter.get("/attendance/student", authorize([Role.ADMIN, Role.PEDAGOGIA]), async (req, res) => {
  const studentId = req.query.studentId?.toString();
  const moduleId = req.query.moduleId?.toString();
  if (!studentId || !moduleId) {
    return res.status(400).json({ message: "studentId and moduleId are required" });
  }

  const lessons = await prisma.lesson.findMany({ where: { moduleId }, select: { id: true } });
  const attendance = await prisma.attendance.findMany({ where: { studentId, lessonId: { in: lessons.map((lesson) => lesson.id) } } });
  const total = lessons.length;
  const present = attendance.filter((item) => item.status === "PRESENTE").length;

  return res.json({ total, present, percentage: total ? Math.round((present / total) * 100) : 0 });
});

reportsRouter.get("/attendance/module", authorize([Role.ADMIN, Role.PEDAGOGIA]), async (req, res) => {
  const moduleId = req.query.moduleId?.toString();
  if (!moduleId) {
    return res.status(400).json({ message: "moduleId is required" });
  }

  const lessons = await prisma.lesson.findMany({ where: { moduleId }, include: { attendance: true } });
  const report = lessons.map((lesson) => ({
    lessonId: lesson.id,
    date: lesson.date,
    present: lesson.attendance.filter((att) => att.status === "PRESENTE").length,
    absent: lesson.attendance.filter((att) => att.status === "AUSENTE").length
  }));

  return res.json(report);
});
