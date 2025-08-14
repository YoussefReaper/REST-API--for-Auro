const mongoose = require('mongoose');

const chatHistorySchema = new mongoose.Schema({
    chatId: String,
    messages: [
        {
            sender: {type: String, enum: ['ai', 'user']},
            text: String,
            timestamp: { type: Date, default: Date.now}
        }
    ]
});

const achievementSchema = new mongoose.Schema({
    name: String,
    description: String,
    dateEarned: {type: Date, default: Date.now}
});

const customizationSchema = new mongoose.Schema({
    colorPreset: { type: String, default: 'default'},
    background: { type: String, default: 'default.jpg'},
    chatBackground: { type: String, default: 'default.jpg'},
    trackerBackground: { type: String, default: 'default.jpg'},
    preferences: {
        notifications: {type: Boolean, default: true},
        sound: {type: Boolean, default: true},
        language: {type: String, default: 'en'}
    },
    topbarThemesOwned: [String],
    colorPresetOwned: [String],
    stickersOwned: [String]
});

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    profilePicture: { type: String, default: 'default.jpg' },
    profileDescription: { type: String, default: '' },
    aiName: { type: String, default: 'AI Assistant' },
    aiProfilePicture: { type: String, default: 'default.jpg' },
    aiPersonality: { type: String, default: '' },
    aiDescription: { type: String, default: '' },
    subscription: { type: String, default: 'free' },
    badHabits: [String],
    goodHabits: [String],
    chatHistories: [chatHistorySchema],
    achievements: [achievementSchema],
    memories: [{type: mongoose.Schema.Types.ObjectId, ref: 'Memory'}],
    customization: customizationSchema,
    tasks: [{type: mongoose.Schema.Types.ObjectId, ref: 'Task'}],
    trackers: [{type: mongoose.Schema.Types.ObjectId, ref: 'Tracker'}]
}, {timestamps: true});

module.exports = mongoose.model('User', userSchema);