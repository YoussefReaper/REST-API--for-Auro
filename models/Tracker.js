const mongoose = require('mongoose');

const trackerSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    trackerHours: { type: Number, default: 0 },
    completedTasksCount: { type: Number, default: 0},
    date: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Tracker', trackerSchema);