import { Router } from "express";
import { z } from "zod";
import { prisma } from "../utils/prisma.js";
import { authenticate } from "../middleware/auth.js";
import { authorize } from "../middleware/rbac.js";
import { audit } from "../middleware/audit.js";
import { ChargeStatus, Role } from "@prisma/client";

export const billingRouter = Router();

billingRouter.use(authenticate);

billingRouter.post("/profiles", authorize([Role.ADMIN, Role.TESOURARIA]), audit("create", "billing_profile"), async (req, res) => {
  const result = z
    .object({ classId: z.string().uuid(), monthlyValue: z.number().int().positive(), dueDay: z.number().int().min(1).max(28) })
    .safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ message: "Invalid payload", errors: result.error.flatten() });
  }

  const profile = await prisma.billingProfile.upsert({
    where: { classId: result.data.classId },
    update: { monthlyValue: result.data.monthlyValue, dueDay: result.data.dueDay },
    create: result.data
  });
  return res.status(201).json(profile);
});

billingRouter.post("/charges/generate", authorize([Role.ADMIN, Role.TESOURARIA]), audit("create", "charge"), async (req, res) => {
  const result = z
    .object({ classId: z.string().uuid(), competence: z.string().regex(/^\d{4}-\d{2}$/) })
    .safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ message: "Invalid payload", errors: result.error.flatten() });
  }

  const profile = await prisma.billingProfile.findUnique({ where: { classId: result.data.classId } });
  if (!profile) {
    return res.status(400).json({ message: "Billing profile not found" });
  }

  const enrollments = await prisma.enrollment.findMany({ where: { classId: result.data.classId, endDate: null } });
  const dueDate = new Date(`${result.data.competence}-01T00:00:00.000Z`);
  dueDate.setUTCDate(profile.dueDay);

  const charges = await Promise.all(
    enrollments.map((enrollment) =>
      prisma.charge.upsert({
        where: { studentId_classId_competence: { studentId: enrollment.studentId, classId: enrollment.classId, competence: result.data.competence } },
        update: {},
        create: {
          studentId: enrollment.studentId,
          classId: enrollment.classId,
          competence: result.data.competence,
          amount: profile.monthlyValue,
          dueDate
        }
      })
    )
  );

  return res.status(201).json({ count: charges.length });
});

billingRouter.get("/charges", authorize([Role.ADMIN, Role.TESOURARIA, Role.SECRETARIA]), async (req, res) => {
  const classId = req.query.classId?.toString();
  const competence = req.query.competence?.toString();
  const status = req.query.status?.toString() as ChargeStatus | undefined;

  const charges = await prisma.charge.findMany({
    where: {
      classId: classId || undefined,
      competence: competence || undefined,
      status: status || undefined
    },
    include: { student: true, payments: true }
  });

  const today = new Date();
  await Promise.all(
    charges.map(async (charge) => {
      const paid = charge.payments.reduce((sum, payment) => sum + payment.amount, 0);
      if (paid >= charge.amount && charge.status !== ChargeStatus.PAGO) {
        charge.status = ChargeStatus.PAGO;
        await prisma.charge.update({ where: { id: charge.id }, data: { status: ChargeStatus.PAGO } });
      } else if (paid < charge.amount && charge.dueDate < today && charge.status !== ChargeStatus.ATRASADO) {
        charge.status = ChargeStatus.ATRASADO;
        await prisma.charge.update({ where: { id: charge.id }, data: { status: ChargeStatus.ATRASADO } });
      }
    })
  );

  return res.json(charges);
});

billingRouter.get("/dashboard", authorize([Role.ADMIN, Role.TESOURARIA]), async (_req, res) => {
  const charges = await prisma.charge.findMany({ include: { payments: true } });
  const totals = charges.reduce(
    (acc, charge) => {
      const paid = charge.payments.reduce((sum, payment) => sum + payment.amount, 0);
      acc.received += paid;
      if (paid < charge.amount) {
        acc.open += charge.amount - paid;
      }
      if (charge.status === ChargeStatus.ATRASADO) {
        acc.overdue += charge.amount - paid;
      }
      return acc;
    },
    { received: 0, open: 0, overdue: 0 }
  );

  return res.json(totals);
});
