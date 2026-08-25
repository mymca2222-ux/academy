import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [1, 'Age must be at least 1'],
    max: [120, 'Age must be less than 120']
  },
  course: {
    type: String,
    required: [true, 'Course is required'],
    trim: true
  },
  grade: {
    type: String,
    required: [true, 'Grade is required'],
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

const Student = mongoose.model('Student', studentSchema);

export default Student;


