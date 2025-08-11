const Milestone = require('../models/Milestone');

exports.createMilestone = async (req, res) => {
    try{
        const milestone = new Milestone({
            ...req.body,
            userId: req.user.id
        });
        await milestone.save();
        res.status(201).json(milestone);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getMilestones = async (req, res) => {
    try{
        const milestones = await Milestone.find({ userId: req.user.id })
            .populate('tasks')
            .populate('notes');
        if (!milestones) return res.status(404).json({ message: 'No milestones found' });
        res.status(200).json(milestones);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateMilestone = async (req, res) => {
    try {
        const milestone = await Milestone.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            req.body,
            { new: true }
        );
        if (!milestone) return res.status(404).json({ message: 'Milestone not found' });
        res.json(milestone);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.deleteMilestone = async (req, res) => {
    try {
        const deleted = await Milestone.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        if (!deleted) return res.status(404).json({ message: 'Milestone not found' });
        res.json({ message: 'Milestone deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}