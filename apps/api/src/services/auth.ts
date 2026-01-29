import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { env } from "../utils/env.js";
import { Role, User } from "@prisma/client";

export type JwtPayload = {
  sub: string;
  role: Role;
};

export const authService = {
  signAccessToken(payload: JwtPayload) {
    return jwt.sign(payload, env.jwtAccessSecret, { expiresIn: env.jwtAccessExpiresIn });
  },
  signRefreshToken(payload: JwtPayload) {
    return jwt.sign(payload, env.jwtRefreshSecret, { expiresIn: env.jwtRefreshExpiresIn });
  },
  verifyAccessToken(token: string) {
    return jwt.verify(token, env.jwtAccessSecret) as JwtPayload;
  },
  verifyRefreshToken(token: string) {
    return jwt.verify(token, env.jwtRefreshSecret) as JwtPayload;
  },
  async comparePassword(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  },
  async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  },
  toAuthResponse(user: Pick<User, "id" | "email" | "name" | "role">) {
    const payload: JwtPayload = { sub: user.id, role: user.role };
    return {
      user,
      accessToken: authService.signAccessToken(payload),
      refreshToken: authService.signRefreshToken(payload)
    };
  }
};
