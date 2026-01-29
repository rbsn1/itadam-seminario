import bcrypt from "bcryptjs";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

const defaultUsers = [
  { name: "Admin", email: "admin@itadam.local", role: Role.ADMIN },
  { name: "Secretaria", email: "secretaria@itadam.local", role: Role.SECRETARIA },
  { name: "Pedagogia", email: "pedagogia@itadam.local", role: Role.PEDAGOGIA },
  { name: "Tesouraria", email: "tesouraria@itadam.local", role: Role.TESOURARIA }
];

async function main() {
  const password = await bcrypt.hash("Admin@123", 10);

  for (const user of defaultUsers) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        name: user.name,
        email: user.email,
        role: user.role,
        password
      }
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
