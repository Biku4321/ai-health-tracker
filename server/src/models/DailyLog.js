// const mongoose = require("mongoose");

// const dailyLogSchema = mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       required: true,
//       ref: "User",
//     },
//     date: {
//       type: Date,
//       default: Date.now,
//     },
//     // 🍽️ Diet: Array of meals to track calories and timing
//     diet: [
//       {
//         mealName: { type: String, required: true }, // e.g., "Oatmeal & Berries"
//         calories: { type: Number },
//         time: { type: String }, // e.g., "08:30 AM"
//       },
//     ],
//     // 💤 Sleep: Crucial for mental health analysis
//     sleep: {
//       hours: { type: Number, required: true },
//       quality: {
//         type: String,
//         enum: ["Poor", "Fair", "Good", "Excellent"],
//         default: "Good",
//       },
//     },
//     // 🏃 Exercise
//     exercise: {
//       activity: { type: String }, // e.g., "Running"
//       durationMinutes: { type: Number },
//       intensity: { type: String, enum: ["Low", "Medium", "High"] },
//     },
//     // 😄 Mood: The core metric for this app
//     mood: {
//       score: { type: Number, min: 1, max: 10, required: true }, // 1-10 Scale
//       label: {
//         type: String,
//         enum: ["Happy", "Sad", "Stressed", "Energetic", "Calm", "Anxious"],
//       },
//       note: { type: String }, // specific trigger?
//     },
//     // 🤕 Symptoms
//     symptoms: [{ type: String }], // e.g., ["Headache", "Fatigue"]
//     steps: { type: Number, default: 0 },
//     heartRate: {
//       avg: { type: Number },
//       resting: { type: Number },
//     },
//     deviceSource: { type: String },
//   },

//   { timestamps: true }
// );

// module.exports = mongoose.model("DailyLog", dailyLogSchema);
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