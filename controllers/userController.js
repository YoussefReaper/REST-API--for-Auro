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
            profilePicture: user.profilePicture,
            profileDescription: user.profileDescription,
            aiName: user.aiName,
            aiProfilePicture: user.aiProfilePicture,
            aiPersonality: user.aiPersonality,
            aiDescription: user.aiDescription,
            subscription: user.subscription,
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

exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({message: 'User not found'});
        const { profileDescription, profilePicture, aiName, aiDescription, aiPersonality } = req.body;
        user.profileDescription = profileDescription || user.profileDescription;
        user.profilePicture = profilePicture || user.profilePicture;
        user.aiName = aiName || user.aiName;
        user.aiDescription = aiDescription || user.aiDescription;
        user.aiPersonality = aiPersonality || user.aiPersonality;
        user.aiProfilePicture = profilePicture || user.aiProfilePicture;
        await user.save();
        res.status(201).json({message: 'Profile updated'});
    } catch(err) {
        res.status(500).json({message: 'server error', error: err.message});
    }
};

exports.updateSubscription = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({message: 'User not found'});
        user.subscription = req.body.subscription || user.subscription;
        await user.save();
        res.status(201).json({message: 'Subscription updated'});
    } catch(err) {
        res.status(500).json({message: 'server error', error: err.message});
    }
};
