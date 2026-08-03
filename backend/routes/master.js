const express = require("express");
const router = express.Router();
const masterController = require("../controllers/masterController");
const authMiddleware = require("../middlewares/authMiddleware");

// Lembaga Routes
router.get("/lembaga", masterController.getLembaga);
router.post("/lembaga", authMiddleware, masterController.createLembaga);
router.put("/lembaga/:id", authMiddleware, masterController.updateLembaga);
router.post("/lembaga/delete-multiple", authMiddleware, masterController.deleteLembaga); // using POST for delete multiple to send body

// Guru Routes
router.get("/guru", masterController.getGuru);
router.post("/guru", authMiddleware, masterController.createGuru);
router.post("/guru/delete-multiple", authMiddleware, masterController.deleteGuru);

// Santri Routes
router.get("/santri", masterController.getSantri);
router.post("/santri", authMiddleware, masterController.createSantri);
router.post("/santri/delete-multiple", authMiddleware, masterController.deleteSantri);

module.exports = router;
