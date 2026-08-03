const { createClient } = require("@libsql/client");
const { PrismaLibSql } = require("@prisma/adapter-libsql");
try {
  const libsql = createClient({ url: "file:./dev.db" });
  console.log("LibSQL Client Created");
  const adapter = new PrismaLibSql(libsql);
  console.log("Adapter Created");
} catch(e) {
  console.error(e);
}
