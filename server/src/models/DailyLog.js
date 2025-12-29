const mongoose = require('mongoose');

const dailyLogSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    date: { type: Date, default: Date.now },
    
    diet: [{
      mealName: String,
      calories: Number,
      time: String,
    }],
    
    sleep: {
      hours: { type: Number, required: true },
      quality: { type: String, enum: ['Poor', 'Fair', 'Good', 'Excellent'] },
    },
    
    exercise: {
      activity: String,
      durationMinutes: Number,
      intensity: String,
    },
    
    mood: {
      score: { type: Number, min: 1, max: 10 },
      label: String,
      note: String,
    },

    // ⌚ Wearable Integration Fields
    steps: { type: Number, default: 0 },
    heartRate: {
      avg: Number,
      resting: Number
    },
    deviceSource: { type: String }, // e.g., 'Apple Health', 'Google Fit'
  },
  { timestamps: true }
);

module.exports = mongoose.model('DailyLog', dailyLogSchema);