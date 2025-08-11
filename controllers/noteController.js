const Note = require('../models/Note');

exports.createNote = async (req,res) => {
    try {
        const note = new Note({ ...req.body });
        await note.save();
        res.status(201).json(note);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.getNotes = async (req, res) => {
    try{
        const notes = await Note.find().populate('linkedNotes');
        res.json(notes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getNoteById = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id).populate('linkedNotes');
        if (!note) return res.status(404).json({ message: 'Note not found' });
        res.json(note);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateNote = async (req, res) => {
    try {
        const deleted = await Note.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Note not found'});
        res.json({ message: 'Note deleted'});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteNote = async (req, res) => {
    try {
        const deleted = await Note.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Note not found'});
        res.json({ message: 'Note deleted'});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};