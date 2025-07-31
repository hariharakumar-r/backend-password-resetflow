const User = require("../models/User");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required." });
    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "User already exists." });
    await User.create({ email, password });
    res.status(201).json({ message: "User registered." });
  } catch (err) {
    res.status(500).json({ message: "Registration failed." });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required." });
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: "Invalid credentials." });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Login failed." });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res.status(400).json({ message: "Email is required." });
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found." });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 15 * 60 * 1000;
    await user.save();

    const link = `${process.env.CLIENT_URL}/reset-password/${token}`;
    await sendEmail({
      to: email,
      subject: "Reset your password",
      html: `<p>Click <a href="${link}">here</a> to reset your password. Link expires in 15 minutes.</p>`,
    });

    res.json({ message: "Password reset email sent." });
  } catch (err) {
    res.status(500).json({ message: "Failed to send reset email." });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    if (!token || !password)
      return res.status(400).json({ message: "Token and password required." });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      _id: payload.userId,
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });
    if (!user)
      return res.status(400).json({ message: "Invalid or expired token." });
    user.password = password;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();
    res.json({ message: "Password reset successful." });
  } catch (err) {
    res.status(400).json({ message: "Invalid or expired token." });
  }
};
