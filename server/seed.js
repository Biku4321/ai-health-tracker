const mongoose = require('mongoose');
const dotenv = require('dotenv');
const DailyLog = require('./src/models/DailyLog');
const User = require('./src/models/User');

dotenv.config();

const seedData = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  
  // 1. Get the first user found in DB
  const user = await User.findOne();
  if (!user) {
    console.log("❌ No user found. Sign up via Frontend first!");
    process.exit();
  }

  console.log(`🌱 Seeding logs for user: ${user.name}`);

  // 2. Create 3 days of logs
  const logs = [
    {
      user: user._id,
      date: new Date(new Date().setDate(new Date().getDate() - 2)), // 2 days ago
      mood: { score: 4, label: 'Stressed', note: 'Work deadline' },
      sleep: { hours: 5.5, quality: 'Poor' },
      exercise: { activity: 'None', durationMinutes: 0 },
      diet: [{ mealName: 'Pizza', calories: 800 }]
    },
    {
      user: user._id,
      date: new Date(new Date().setDate(new Date().getDate() - 1)), // Yesterday
      mood: { score: 6, label: 'Calm', note: 'Recovering' },
      sleep: { hours: 7, quality: 'Fair' },
      exercise: { activity: 'Walking', durationMinutes: 20 },
      diet: [{ mealName: 'Salad', calories: 400 }]
    },
    {
      user: user._id,
      date: new Date(), // Today
      mood: { score: 8, label: 'Energetic', note: 'Good sleep!' },
      sleep: { hours: 8.5, quality: 'Excellent' },
      exercise: { activity: 'Gym', durationMinutes: 45 },
      diet: [{ mealName: 'Oats & Chicken', calories: 1200 }]
    }
  ];

  await DailyLog.deleteMany({ user: user._id }); // Clear old logs
  await DailyLog.insertMany(logs);

  console.log("✅ Seed Data Injected! You can now ask the AI about your history.");
  process.exit();
};

seedData();