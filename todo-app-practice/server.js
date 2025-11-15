import express from 'express';

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


// GET /api/tasks – повернути всі задачі
app.get('/api/tasks', (req, res) => {
    res.json(tasks);
});

// POST /api/tasks – створити нову задачу
app.post('/api/tasks', (req, res) => {
    const { title } = req.body;
    if (!title) {
        return res.status(400).json({ error: "Title is required" });
    }

    const newTask = {
        id: nextId++,
        title,
        completed: false
    };

    tasks.push(newTask);
    res.status(201).json(newTask);
});

// PUT /api/tasks/:id – змінити статус задачі
app.put('/api/tasks/:id', (req, res) => {
    const id = Number(req.params.id);
    const task = tasks.find(t => t.id === id);

    if (!task) {
        return res.status(404).json({ error: "Task not found" });
    }

    task.completed = !task.completed;
    res.status(200).json(task);
});

// DELETE /api/tasks/:id – видалити задачу
app.delete('/api/tasks/:id', (req, res) => {
    const id = Number(req.params.id);

    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) {
        return res.status(404).json({ error: "Task not found" });
    }

    tasks.splice(index, 1);
    res.sendStatus(204);
});

app.get('/tasks', (req, res) => {
    res.render('tasks', { tasks });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
