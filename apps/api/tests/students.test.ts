import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../src/app.js";
import { Role } from "@prisma/client";
import { authService } from "../src/services/auth.js";

const prismaMock = {
  user: {
    findUnique: vi.fn()
  },
  student: {
    count: vi.fn(),
    findMany: vi.fn()
  }
};

vi.mock("../src/utils/prisma.js", () => ({ prisma: prismaMock }));

describe("students", () => {
  beforeEach(() => {
    prismaMock.user.findUnique.mockReset();
    prismaMock.student.count.mockReset();
    prismaMock.student.findMany.mockReset();
  });

  it("lists students with pagination", async () => {
    prismaMock.user.findUnique.mockResolvedValue({ id: "user-1", role: Role.SECRETARIA });
    prismaMock.student.count.mockResolvedValue(1);
    prismaMock.student.findMany.mockResolvedValue([{ id: "student-1", name: "Aluno" }]);
    vi.spyOn(authService, "verifyAccessToken").mockReturnValue({ sub: "user-1", role: Role.SECRETARIA });

    const response = await request(app)
      .get("/api/students")
      .set("Authorization", "Bearer token");

    expect(response.status).toBe(200);
    expect(response.body.items).toHaveLength(1);
  });
});
