const User = require('../models/User');

exports.addHabit = async (req, res) => {
    const {type,habit} = req.body;
    if(!type||!habit) return res.status(400).json({message: 'Type and habit are required'});
    try{
        const user= await User.findById(req.user.id);
        if(!user) return res.status(404).json({message:'User not found'});
        if(type === 'good'){
            if (!user.goodHabits.includes(habit))  user.goodHabits.push(habit);
        } else if(type === 'bad'){
            if (!user.badHabits.includes(habit))  user.badHabits.push(habit);
        }
        await user.save();
        res.status(201).json({ message: 'Habit added', goodHabits: user.goodHabits, badHabits: user.badHabits});
    } catch(err) {
        res.status(500).json({message: 'Server error', error: err.message});
    }
};

exports.removeHabit = async (req, res) => {
    const {type,habit} = req.body;
    if(!type||!habit) return res.status(400).json({message: 'Type and habit are required'});

    try{
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({message: 'User not found'});

        if(type === 'good') {
            user.goodHabits = user.goodHabits.filter(h => h !== habit);
        } else if(type === 'bad') {
            user.badHabits = user.badHabits.filter(h => h !== habit);
        } else {
            return res.status(400).json({message: 'Invalid type, must be "good" or "bad"'});
        }

        await user.save();
        res.status(204).json({ message: 'Habit removed', goodHabits: user.goodHabits, badHabits: user.badHabits});
    } catch(err) {
        res.status(500).json({message: 'Server error', error: err.message});
    }
};

exports.getHabits = async (req, res) => {
    const {type} = req.query;
    try {
        const user = await User.findById(req.user.id).select('goodHabits badHabits');
        if(!user) return res.status(404).json({message:'User not found'});

        if (type==='good') return res.status(200).json(user.goodHabits);
        if (type==='bad') return res.status(200).json(user.badHabits);
        return res.status(200).json({ goodHabits: user.goodHabits, badHabits: user.badHabits});
    } catch(err) {
        res.status(500).json({message: 'Server error', error: err.message});
    }
};