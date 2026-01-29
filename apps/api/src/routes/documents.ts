import { Router } from "express";
import multer from "multer";
import { prisma } from "../utils/prisma.js";
import { authenticate } from "../middleware/auth.js";
import { authorize } from "../middleware/rbac.js";
import { audit } from "../middleware/audit.js";
import { Role } from "@prisma/client";

const storage = multer.diskStorage({
  destination: "uploads",
  filename: (_req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

export const documentsRouter = Router();

documentsRouter.use(authenticate);

documentsRouter.post("/", authorize([Role.ADMIN, Role.SECRETARIA]), upload.single("file"), audit("create", "document"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "File required" });
  }

  const studentId = req.body.studentId as string | undefined;
  if (!studentId) {
    return res.status(400).json({ message: "studentId required" });
  }

  const document = await prisma.document.create({
    data: {
      studentId,
      name: req.file.originalname,
      url: `/uploads/${req.file.filename}`
    }
  });

  return res.status(201).json(document);
});
