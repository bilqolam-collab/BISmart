const express = require("express");
const router = express.Router();
const webController = require("../controllers/webController");
const authMiddleware = require("../middlewares/authMiddleware");

// Profil Web
router.get("/profil", webController.getProfilWeb);
router.put("/profil", authMiddleware, webController.updateProfilWeb);

module.exports = router;
