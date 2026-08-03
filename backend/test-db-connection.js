require('dotenv').config();
const prisma = require('./prismaClient');

async function testConnection() {
  try {
    console.log("Testing connection...");
    console.log("DATABASE_URL:", process.env.DATABASE_URL);
    await prisma.$queryRaw`SELECT 1`;
    console.log("Connection successful!");
  } catch (error) {
    console.error("Connection failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
