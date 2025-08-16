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

        const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
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
            achievements: user.achievements,
        });
    } catch(err) {
        res.status(500).json({message: 'server error', error: err.message});
    }
};

exports.updateCustomization = async (req, res) => {
    try {
        const allowedFields = [
            'themeMode', 'colorPalette', 'backgrounds',
            'trackerBackgrounds', 'chatAppearance',
            'preferences', 'topbarTheme'
        ];
        const updates = {};
        if (req.body.settings) {
            let settings;
            try {
                settings = JSON.parse(req.body.settings);
            } catch (err) {
                return res.status(400).json({ message: 'Invalid JSON in settings' });
            }

            allowedFields.forEach(field => {
                if (settings[field] !== undefined) {
                    updates[`customization.${field}`] = settings[field];
                }
            });
        }
        if (req.files) {
            if (req.files['backgrounds_desktop']) {
                updates['customization.backgrounds.desktop'] = req.files['backgrounds_desktop'][0].path;
            }
            if (req.files['backgrounds_mobile']) {
                updates['customization.backgrounds.mobile'] = req.files['backgrounds_mobile'][0].path;
            }
            if (req.files['chat_background']) {
                updates['customization.chatAppearance.background'] = req.files['chat_background'][0].path;
            }
            if (req.files['tracker_desktop_main']) {
                updates['customization.trackerBackgrounds.desktop_main'] = req.files['tracker_desktop_main'][0].path;
            }
            if (req.files['tracker_desktop_pause']) {
                updates['customization.trackerBackgrounds.desktop_pause'] = req.files['tracker_desktop_pause'][0].path;
            }
            if (req.files['tracker_mobile_main']) {
                updates['customization.trackerBackgrounds.mobile_main'] = req.files['tracker_mobile_main'][0].path;
            }
            if (req.files['tracker_mobile_pause']) {
                updates['customization.trackerBackgrounds.mobile_pause'] = req.files['tracker_mobile_pause'][0].path;
            }
        }
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'Customization updated successfully', user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'server error', error: err.message });
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
        if (!user.isCompleted) {
            user.isCompleted = true;
            await user.save();
        }
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

exports.changeCoins = async (req,res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({message: 'User not found'});
        user.coins += req.body.coins || 0;
        await user.save();
        res.status(201).json({message: 'Coins changed successfully'});
    } catch(err) {
        res.status(500).json({message: 'server error', error: err.message});
    }
};

exports.getCustomizations = async (req,res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({message: 'User not found'});
        res.json({
            themeMode: user.customization.themeMode,
            colorPalette: user.customization.colorPalette,
            backgrounds: user.customization.backgrounds,
            trackerBackgrounds: user.customization.trackerBackgrounds,
            chatAppearance: user.customization.chatAppearance,
            preferences: user.customization.preferences,
            topbarTheme: user.customization.topbarTheme
        });
    } catch(err) {
        res.status(500).json({message: 'server error', error: err.message});
    }
};