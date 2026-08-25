const express = require('express');
const PYQ = require('../models/PYQ');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const filter = req.query.subject ? { subject: { $in: req.query.subject.split(',') } } : {};
    const pyqs = await PYQ.find(filter).populate('subject').sort({ year: -1 });
    res.json(pyqs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const pyq = await PYQ.create(req.body);
    res.status(201).json(pyq);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const pyq = await PYQ.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(pyq);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    await PYQ.findByIdAndDelete(req.params.id);
    res.json({ message: 'PYQ deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
