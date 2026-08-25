const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  type: { type: String, enum: ['notes', 'video'], required: true },
  title: { type: String, required: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  unit: { type: String },
  url: { type: String, required: true },
  description: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Resource', resourceSchema);
