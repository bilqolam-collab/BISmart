let app;
let initError = null;
try {
  app = require("../backend/index.js");
} catch (err) {
  initError = err;
}

module.exports = (req, res) => {
  if (initError) {
    return res.status(500).json({ 
      error: "Init failed", 
      details: initError.message, 
      stack: initError.stack 
    });
  }
  return app(req, res);
};
