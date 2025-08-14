const User = require('../models/User');
const { Resend } = require('resend');
const crypto = require('crypto');

const resend = new Resend(process.env.RESEND_API_KEY);

exports.sendVerificationEmail = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({message: 'User not found'});

        if (user.isVerified) {
            return res.status(400).json({message: 'Email already verified'});
        }

        const token = crypto.randomBytes(32).toString('hex');
        user.emailVerificationToken = token;
        user.emailVerificationExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        const verificationUrl = `${process.env.CLIENT_URL}/auth/verify-email?token=${token}`;
        await resend.emails.send({
            from: 'AuroCore <noreply@aurocore.me>',
            to: user.email,
            subject: 'Verify your email',
            html: `<h2>Welcome to AuroCore</h2>
                   <p>Please verify your email by clicking the link below:</p>
                   <a href="${verificationUrl}">${verificationUrl}</a>
                   <p>This link will expire in 1 hour.</p>`
        });

        res.json({message: 'Verification email sent'});
    } catch (err) {
        res.status(500).json({message: 'Error sending verification email'});
    }
};

exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;
        const user = await User.findOne({
            emailVerificationToken: token,
            emailVerificationExpires: { $gt: Date.now()}
        });

        if (!user) {
            return res.status(400).json({message: 'Invalid or expired token'});
        }

        user.isVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpires = undefined;
        await user.save();
        res.json({message: 'Email verified successfully'});
    } catch (err) {
        res.status(500).json({message: 'Error verifying email'});
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .populate('memories')
            .populate('tasks')
            .populate('trackers');
        if(!user) return res.status(404).json({message: 'User not found'});

        res.json({
            username: user.username,
            displayName: user.displayName,
            email: user.email,
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
        const { profileDescription, aiName, aiDescription, aiPersonality, displayName } = req.body;

        if (req.files && req.files.profilePicture) {
            user.profilePicture = req.files.profilePicture[0].path;
        }

        if (req.files && req.files.aiProfilePicture) {
            user.aiProfilePicture = req.files.aiProfilePicture[0].path;
        }

        user.displayName = displayName || user.displayName;
        user.profileDescription = profileDescription || user.profileDescription;
        user.aiName = aiName || user.aiName;
        user.aiDescription = aiDescription || user.aiDescription;
        user.aiPersonality = aiPersonality || user.aiPersonality;
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
