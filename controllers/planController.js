const Plan = require('../models/Plan');

exports.createPlan = async (req, res) => {
    try {
        const plan = new Plan({
            ...req.body,
            userId: req.user.id
        });
        await plan.save();
        res.status(201).json(plan);
    } catch (err) {
        res.status(500).json({ message: err.message});
    }
};

exports.getPlans = async (req, res) => {
    try {
        const plans = await Plan.find({ userId: req.user.id})
            .populate('milestones')
            .populate('notes');
        res.json(plans);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getPlanById = async (req, res) => {
    try {
        const plan = await Plan.findById(req.params.id)
            .populate('milestones')
            .populate('notes');
        if (!plan) {
            return res.status(404).json({ message: 'Plan not found' });
        }
        res.json(plan);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updatePlan = async (req, res) => {
    try{
        const plan = await Plan.findOneAndUpdate(
            {_id: req.params.id, userId: req.user.id},
            req.body,
            {new: true}
        );
        if (!plan) return res.status(404).json({ message: 'Plan not found'});
        res.json(plan);
    } catch (err) {
        res.status(500).json({ message: err.message});
    }
};

exports.deletePlan = async (req, res) => {
    try {
        const deleted = await Plan.findOneAndDelete({ _id: req.params.id, userId: req.user.id});
        if (!deleted) return res.status(404).json({ message: 'Plan not found'});
        res.json({ message: 'Plan deleted'});
    } catch (err) {
        res.status(500).json({ message: err.message});
    }
};
