const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String
        },
        status: {
            type: String,
            enum: ["pending", "completed"],
            default: "pending"
        },
        priority: {
            type: Number,
            min: 1,
            max: 5
        },
        dueDate: {
            type: Date
        }
    },
    { timestamps: true } // додасть createdAt та updatedAt
);

module.exports = mongoose.model("Task", TaskSchema);
