const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    title: {type: String, required: true},
    description: String,
    dueDate: Date,
    completed: {type: Boolean, default: false},
    createdAt: {type: Date, default: Date.now},
    progress: {type: Number, default: 0},
    category: String,
    priority: {type: String, enum: ['low', 'medium', 'high'], default: 'medium'},
    repeat: {
        type: {type: String, enum: ['none', 'daily', 'weekly', 'monthly', 'custom'], default: 'none'},
        customDays: [String]
    },
    completedAt: Date,
    attachments: [
        {
            type: {type: String, enum: ['image', 'pdf', 'link', 'file']},
            url: String
        }
    ]
});

module.exports = mongoose.model('Task', taskSchema);