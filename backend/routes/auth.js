const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

// @route   POST api/auth/init
// @desc    Initialize first admin (Helper route)
// @access  Public
router.post("/init", authController.initAdmin);

// @route   POST api/auth/login
// @desc    Authenticate admin & get token
// @access  Public
router.post("/login", authController.login);

// @route   GET api/auth/me
// @desc    Get logged in admin info
// @access  Private
router.get("/me", authMiddleware, authController.getMe);

module.exports = router;
