require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin123", salt);

    const admin = await prisma.admin.upsert({
      where: { username: "admin" },
      update: {
        password: hashedPassword,
        name: "Administrator"
      },
      create: {
        username: "admin",
        password: hashedPassword,
        name: "Administrator"
      }
    });

    console.log("SUCCESS: Admin account created/updated successfully!", admin);
  } catch (error) {
    console.error("ERROR seeding admin account:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
