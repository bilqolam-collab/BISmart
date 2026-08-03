const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");
const authMiddleware = require("../middlewares/authMiddleware");

// Syahadah
router.get("/syahadah", authMiddleware, transactionController.getSyahadah);
router.post("/syahadah", transactionController.createSyahadah); // Public can create
router.put("/syahadah/:id/status", authMiddleware, transactionController.updateSyahadahStatus);

// Kitab Order
router.get("/orders", authMiddleware, transactionController.getOrders);
router.post("/orders", transactionController.createOrder); // Public can create
router.put("/orders/:id/status", authMiddleware, transactionController.updateOrderStatus);
router.put("/orders/:id/prices", authMiddleware, transactionController.updateOrderPrices);

module.exports = router;
