import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../src/app.js";
import { authService } from "../src/services/auth.js";
import { Role } from "@prisma/client";

const prismaMock = {
  user: {
    findUnique: vi.fn()
  }
};

vi.mock("../src/utils/prisma.js", () => ({ prisma: prismaMock }));

describe("auth", () => {
  beforeEach(() => {
    prismaMock.user.findUnique.mockReset();
  });

  it("returns tokens on login", async () => {
    const user = { id: "user-1", email: "admin@itadam.local", name: "Admin", role: Role.ADMIN, password: "hash" };
    prismaMock.user.findUnique.mockResolvedValue(user);
    vi.spyOn(authService, "comparePassword").mockResolvedValue(true);

    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@itadam.local", password: "Admin@123" });

    expect(response.status).toBe(200);
    expect(response.body.accessToken).toBeTypeOf("string");
    expect(response.body.refreshToken).toBeTypeOf("string");
  });
});
