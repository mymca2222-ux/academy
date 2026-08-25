const mongoose = require('mongoose');

const pyqSchema = new mongoose.Schema({
  title: { type: String, required: true },
  year: { type: String, required: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  url: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('PYQ', pyqSchema);
