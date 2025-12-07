const Task = require("../models/Task");

// CREATE
async function createTask(data) {
    const task = await Task.create(data);
    return task;
}

// READ 
async function getAllTasks() {
    return await Task.find().sort({ createdAt: -1 }); // найновіші зверху
}

async function getTaskById(id) {
    return await Task.findById(id);
}

async function getTasksByStatus(status) {
    return await Task.find({ status });
}

// UPDATE 
async function updateTask(id, updateData) {
    return await Task.findByIdAndUpdate(id, updateData, { new: true });
}

async function markAsCompleted(id) {
    return await Task.findByIdAndUpdate(
        id,
        { status: "completed" },
        { new: true }
    );
}

// DELETE 
async function deleteTask(id) {
    return await Task.findByIdAndDelete(id);
}

// AGGREGATION
async function getTasksSummary() {
    const summary = await Task.aggregate([
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 }
            }
        }
    ]);

    const result = {
        pending: 0,
        completed: 0
    };

    summary.forEach(item => {
        result[item._id] = item.count;
    });

    return result;
}

module.exports = {
    createTask,
    getAllTasks,
    getTaskById,
    getTasksByStatus,
    updateTask,
    markAsCompleted,
    deleteTask,
    getTasksSummary
};
