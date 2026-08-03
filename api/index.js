let app;
try {
  app = require("../backend/index.js");
} catch (err) {
  app = require("express")();
  app.all("*", (req, res) => res.status(500).json({ error: "Init failed", details: err.message, stack: err.stack }));
}
module.exports = app;
