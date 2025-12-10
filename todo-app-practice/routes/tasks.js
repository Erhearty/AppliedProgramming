import express from "express";
import Task from "../models/Task.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// захист всіх маршрутів
router.use(authMiddleware);

// Створити задачу
router.post("/", async (req, res) => {
  try {
    const { title } = req.body;

    const task = await Task.create({
      title,
      userId: req.user.userId
    });

    res.status(201).json({ message: "Створено", task });
  } catch {
    res.status(500).json({ error: "Помилка сервера" });
  }
});

// Отримати задачі поточного користувача
router.get("/", async (req, res) => {
  const tasks = await Task.find({ userId: req.user.userId });
  res.json(tasks);
});

// Оновити
router.put("/:id", async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, userId: req.user.userId });

  if (!task) return res.status(404).json({ error: "Не знайдено" });

  task.completed = !task.completed;
  await task.save();

  res.json({ message: "Оновлено", task });
});

// Видалити
router.delete("/:id", async (req, res) => {
  const task = await Task.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.userId
  });

  if (!task) return res.status(404).json({ error: "Не знайдено" });

  res.json({ message: "Видалено" });
});

export default router;
