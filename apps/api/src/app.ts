import express from "express";
import cors from "cors";
import { authRouter } from "./routes/auth.js";
import { studentsRouter } from "./routes/students.js";
import { classesRouter } from "./routes/classes.js";
import { enrollmentsRouter } from "./routes/enrollments.js";
import { modulesRouter } from "./routes/modules.js";
import { lessonsRouter } from "./routes/lessons.js";
import { billingRouter } from "./routes/billing.js";
import { paymentsRouter } from "./routes/payments.js";
import { documentsRouter } from "./routes/documents.js";
import { reportsRouter } from "./routes/reports.js";
import { usersRouter } from "./routes/users.js";

export const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", authRouter);
app.use("/api/students", studentsRouter);
app.use("/api/classes", classesRouter);
app.use("/api/enrollments", enrollmentsRouter);
app.use("/api/modules", modulesRouter);
app.use("/api/lessons", lessonsRouter);
app.use("/api/billing", billingRouter);
app.use("/api/payments", paymentsRouter);
app.use("/api/documents", documentsRouter);
app.use("/api/reports", reportsRouter);
app.use("/api/users", usersRouter);
