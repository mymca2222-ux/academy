const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  semester: { type: mongoose.Schema.Types.ObjectId, ref: 'Semester' },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
