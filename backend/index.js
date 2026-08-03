require("dotenv").config();
const express = require("express");
const cors = require("cors");
const prisma = require("./prismaClient");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

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

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "BISmart Backend is running!" });
});

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
