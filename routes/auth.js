const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many requests, please try again later.",
});

const auth = require("../middleware/auth");

router.get("/protected", auth, (req, res) => {
  res.json({ message: "You are authenticated", user: req.user });
});

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/forgot-password", limiter, authController.forgotPassword);
router.post("/reset-password/:token", limiter, authController.resetPassword);

module.exports = router;
