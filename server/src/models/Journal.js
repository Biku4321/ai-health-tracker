// const mongoose = require('mongoose');

// const journalSchema = mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       required: true,
//       ref: 'User',
//     },
//     content: {
//       type: String,
//       required: true,
//     },
//     // Fields below will be populated by the AI Engine in Phase 3
//     aiAnalysis: {
//       sentiment: { type: String }, // Positive/Negative
//       moodDetected: { type: String },
//       summary: { type: String },
//       suggestion: { type: String },
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model('Journal', journalSchema);
const mongoose = require('mongoose');

const journalSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  content: { type: String, required: true },
  mood: { type: String },
  sentimentScore: { type: Number },
  summary: { type: String },
  advice: { type: String },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Journal', journalSchema);