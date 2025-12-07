require("dotenv").config();
const mongoose = require("mongoose");

const {
    createTask,
    getAllTasks,
    getTaskById,
    getTasksByStatus,
    updateTask,
    markAsCompleted,
    deleteTask,
    getTasksSummary
} = require("./controllers/TaskController");

// 1. Підключення до MongoDB Atlas
const DB_URI = process.env.DB_URI; // з .env

mongoose
    .connect(DB_URI)
    .then(() => console.log("Підключено до MongoDB Atlas"))
    .catch(err => console.error("Помилка підключення:", err));

(async () => {
    try {
        console.log("\n===== CREATE =====");
        const created = await createTask({
            title: "Навчання Node.js",
            description: "Пройти всі модулі",
            priority: 4,
            dueDate: new Date("2025-02-01")
        });
        console.log("Створено:", created);

        console.log("\n===== READ ALL =====");
        console.log(await getAllTasks());

        console.log("\n===== READ BY ID =====");
        console.log(await getTaskById(created._id));

        console.log("\n===== READ BY STATUS (pending) =====");
        console.log(await getTasksByStatus("pending"));

        console.log("\n===== UPDATE =====");
        console.log(await updateTask(created._id, { priority: 5 }));

        console.log("\n===== MARK AS COMPLETED =====");
        console.log(await markAsCompleted(created._id));

        console.log("\n===== DELETE =====");
        console.log(await deleteTask(created._id));

        console.log("\n===== SUMMARY =====");
        console.log(await getTasksSummary());

    } catch (e) {
        console.error("Виникла помилка:", e);
    }
})();
