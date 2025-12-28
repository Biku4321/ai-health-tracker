const DailyLog = require('../models/DailyLog');
const { processGamification } = require('../utils/gamificationEngine');

// @desc    Create/Update Daily Log
// @route   POST /api/logs
const createDailyLog = async (req, res) => {
  const { diet, sleep, exercise, mood, date } = req.body;
  const logDate = date ? new Date(date) : new Date();
  logDate.setHours(0, 0, 0, 0);

  try {
    const log = await DailyLog.findOneAndUpdate(
      { user: req.user._id, date: logDate },
      { user: req.user._id, date: logDate, diet, sleep, exercise, mood },
      { new: true, upsert: true }
      );
      const gameStats = await processGamification(req.user._id);
    res.status(200).json(log);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// @desc    Get Weekly Logs
// @route   GET /api/logs
const getWeeklyLogs = async (req, res) => {
  try {
    const logs = await DailyLog.find({ user: req.user._id })
      .sort({ date: -1 })
      .limit(7);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createDailyLog, getWeeklyLogs };