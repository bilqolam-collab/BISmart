require("dotenv").config();
const express = require("express");
const cors = require("cors");
const prisma = require("./prismaClient");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Import Routes
const authRoutes = require("./routes/auth");
const masterRoutes = require("./routes/master");
const serviceRoutes = require("./routes/service");
const transactionRoutes = require("./routes/transaction");
const webRoutes = require("./routes/web");

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/master", masterRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/web", webRoutes);

// Root & Test Route
app.get("/", (req, res) => {
  res.json({ status: "OK", message: "BISmart Backend Server is active!" });
});

app.get("/api/health", async (req, res) => {
  try {
    // Check DB connection
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "OK", dbConnected: true, message: "BISmart Backend is running and DB is connected!" });
  } catch (error) {
    res.status(500).json({ status: "ERROR", dbConnected: false, message: "Database connection failed", error: error.message });
  }
});

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
