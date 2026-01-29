import { Router } from "express";
import { z } from "zod";
import { prisma } from "../utils/prisma.js";
import { authenticate, AuthRequest } from "../middleware/auth.js";
import { authorize } from "../middleware/rbac.js";
import { audit } from "../middleware/audit.js";
import { PaymentMethod, Role } from "@prisma/client";

export const paymentsRouter = Router();

paymentsRouter.use(authenticate);

paymentsRouter.post("/", authorize([Role.ADMIN, Role.TESOURARIA]), audit("create", "payment"), async (req: AuthRequest, res) => {
  const result = z
    .object({
      chargeId: z.string().uuid(),
      amount: z.number().int().positive(),
      paidAt: z.string().datetime(),
      method: z.nativeEnum(PaymentMethod),
      notes: z.string().optional().nullable(),
      receiptUrl: z.string().optional().nullable()
    })
    .safeParse(req.body);

  if (!result.success || !req.user) {
    return res.status(400).json({ message: "Invalid payload", errors: result.error?.flatten() });
  }

  const payment = await prisma.payment.create({
    data: {
      chargeId: result.data.chargeId,
      amount: result.data.amount,
      paidAt: new Date(result.data.paidAt),
      method: result.data.method,
      notes: result.data.notes ?? null,
      receiptUrl: result.data.receiptUrl ?? null,
      createdById: req.user.id
    }
  });

  return res.status(201).json(payment);
});
