const DailyLog = require('../models/DailyLog');

// @desc    Sync Wearable Data
// @route   POST /api/integrations/sync
const syncWearableData = async (req, res) => {
  const { provider, data } = req.body; // 'data' could be the CSV rows from frontend

  // Simple simulation logic (or processing CSV data)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const simulatedSteps = Math.floor(Math.random() * 5000) + 5000;

  try {
    const log = await DailyLog.findOneAndUpdate(
      { user: req.user._id, date: today },
      { 
        $set: { 
          steps: simulatedSteps, 
          deviceSource: provider 
        } 
      },
      { new: true, upsert: true }
    );

    res.json({ message: 'Sync successful', data: { steps: simulatedSteps } });
  } catch (error) {
    res.status(500).json({ message: 'Sync failed' });
  }
};

module.exports = { syncWearableData };