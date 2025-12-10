import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Реєстрація
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Заповніть всі поля" });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "Email вже існує" });

    const user = new User({ email, password });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Помилка сервера" });
  }
});

// Логін
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Невірний email" });

    const match = await user.comparePassword(password);
    if (!match) return res.status(400).json({ error: "Невірний пароль" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.json({ token });
  } catch {
    res.status(500).json({ error: "Помилка сервера" });
  }
});

export default router;
