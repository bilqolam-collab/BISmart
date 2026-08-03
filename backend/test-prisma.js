const { PrismaClient } = require("@prisma/client");
const { PrismaLibSql } = require("@prisma/adapter-libsql");
const { createClient } = require("@libsql/client");

const libsql = createClient({
  url: "file:./dev.db",
});
const adapter = new PrismaLibSql(libsql);
const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    const count = await prisma.admin.count();
    console.log("Count:", count);
  } catch(e) {
    console.error(e);
  }
}
main();
