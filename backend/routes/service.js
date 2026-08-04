const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/serviceController");
const authMiddleware = require("../middlewares/authMiddleware");

// Layanan
router.get("/layanan", serviceController.getLayanan);
router.post("/layanan", authMiddleware, serviceController.createLayanan);
router.put("/layanan/:id", authMiddleware, serviceController.updateLayanan);
router.delete("/layanan/:id", authMiddleware, serviceController.deleteLayanan);

// Produk
router.get("/produk", serviceController.getProduk);
router.post("/produk/bulk", authMiddleware, serviceController.createProdukBulk);
router.post("/produk", authMiddleware, serviceController.createProduk);
router.put("/produk/:id", authMiddleware, serviceController.updateProduk);
router.delete("/produk/:id", authMiddleware, serviceController.deleteProduk);

module.exports = router;
