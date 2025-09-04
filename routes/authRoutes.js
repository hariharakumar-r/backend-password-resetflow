const express = require("express");
const authController = require("../Controller/authController");
const auth = require("../utils/auth");

const authRouter = express.Router();

//Public Routes
authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.get("/userInfo", auth.isAuthenticate, authController.userInfo);
authRouter.get("/signout", authController.logout);
authRouter.post("/resetPassword", authController.resetPassword);
authRouter.post("/setNewPassword", authController.setNewPassword);

module.exports = authRouter;
