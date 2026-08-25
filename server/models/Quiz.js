const mongoose = require('mongoose');

const quizQuestionSchema = new mongoose.Schema({
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correct: { type: Number, required: true },
});

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  unit: { type: String },
});

const quizAttemptSchema = new mongoose.Schema({
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  answers: [{ type: Number }],
  score: { type: Number, required: true },
  total: { type: Number, required: true },
}, { timestamps: true });

module.exports = {
  Quiz: mongoose.model('Quiz', quizSchema),
  QuizQuestion: mongoose.model('QuizQuestion', quizQuestionSchema),
  QuizAttempt: mongoose.model('QuizAttempt', quizAttemptSchema),
};
