const User = require('../models/User');

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .populate('memories')
            .populate('tasks')
            .populate('trackers');
        if(!user) return res.status(404).json({message: 'User not found'});

        res.json({
            username: user.username,
            badHabits: user.badHabits,
            goodHabits: user.goodHabits,
            customization: user.customization,
            achievements: user.achievements,
            chatHistories: user.chatHistories,
            memories: user.memories,
            tasks: user.tasks,
            trackers: user.trackers
        });
    } catch(err) {
        res.status(500).json({message: 'server error', error: err.message});
    }
};

exports.updateCustomization = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if(!user) return res.status(404).json({message: 'User not found'});
        user.customization = {...user.customization.toObject(), ...req.body};
        await user.save();
        res.json({message: 'Customization updated'});
    } catch(err) {
        res.status(500).json({message: 'server error', error: err.message});
    }
};
