const express = require('express');
const { Quiz, QuizQuestion, QuizAttempt } = require('../models/Quiz');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const filter = req.query.subject ? { subject: { $in: req.query.subject.split(',') } } : {};
    const quizzes = await Quiz.find(filter).populate('subject');
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const { title, subject, unit, questions } = req.body;
    const quiz = await Quiz.create({ title, subject, unit });
    if (questions && questions.length) {
      await QuizQuestion.insertMany(questions.map(q => ({ ...q, quiz: quiz._id })));
    }
    res.status(201).json(quiz);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('subject');
    const questions = await QuizQuestion.find({ quiz: req.params.id });
    res.json({ ...quiz.toObject(), questions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/:id/attempt', auth, async (req, res) => {
  try {
    const { answers } = req.body;
    const questions = await QuizQuestion.find({ quiz: req.params.id });
    let score = 0;
    questions.forEach((q, i) => { if (answers[i] === q.correct) score++; });
    const attempt = await QuizAttempt.create({ quiz: req.params.id, student: req.user._id, answers, score, total: questions.length });
    res.json({ score, total: questions.length, correct: score, wrong: questions.length - score, attempt });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
