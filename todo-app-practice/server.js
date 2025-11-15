import express from 'express';
import Joi from 'joi';

const app = express();
const PORT = 3000;

app.use(express.json());

app.set('view engine', 'pug');
app.set('views', './views');

let nextId = 3;
let tasks = [
    { id: 1, title: "Купити хліб", completed: false },
    { id: 2, title: "Зробити ДЗ", completed: true }
];

// Joi schema
const taskSchema = Joi.object({
  title: Joi.string().min(3).max(100).required()
});

// GET /api/tasks – повернути всі задачі
app.get('/api/tasks', (req, res) => {
    res.json(tasks);
});

// POST /api/tasks – створити нову задачу
app.post('/api/tasks', (req, res) => {
    try {
        const { error, value } = taskSchema.validate(req.body);

        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        // Перевірка на дубль
        if (tasks.find(t => t.title === value.title)) {
            return res.status(400).json({ error: "Задача вже додана" });
        }

        const newTask = {
            id: nextId++,
            title: value.title,
            completed: false
        };

        tasks.push(newTask);
        return res.status(201).json({ message: 'Задачу створено', task: newTask });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Внутрішня помилка сервера' });
    }
});

// PUT /api/tasks/:id – змінити статус задачі
app.put('/api/tasks/:id', (req, res) => {
    try {
        const id = Number(req.params.id);
        const task = tasks.find(t => t.id === id);

        if (!task) return res.status(404).json({ error: 'Задача не знайдена' });

        task.completed = !task.completed;
        return res.status(200).json({ message: 'Задача оновлена', task });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Внутрішня помилка сервера' });
    }
});

// DELETE /api/tasks/:id – видалити задачу
app.delete('/api/tasks/:id', (req, res) => {
    try {
        const id = Number(req.params.id);
        const index = tasks.findIndex(t => t.id === id);

        if (index === -1) return res.status(404).json({ error: 'Задача не знайдена' });

        tasks.splice(index, 1);
        return res.status(200).json({ message: 'Задачу видалено' });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Внутрішня помилка сервера' });
    }
});

// Pug сторінка
app.get('/tasks', (req, res) => {
    res.render('tasks', { tasks });
});

// Global catch-all для непередбачених маршрутів
app.use((req, res) => {
    res.status(404).json({ error: 'Маршрут не знайдено' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
