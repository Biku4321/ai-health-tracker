// const express = require('express');
// const router = express.Router();
// const { createDailyLog, getWeeklyLogs } = require('../controllers/logController');
// const { protect } = require('../middleware/authMiddleware'); // You need to create this standard JWT middleware

// router.route('/')
//   .post(protect, createDailyLog)
//   .get(protect, getWeeklyLogs);

// module.exports = router;
const express = require('express');
const router = express.Router();
const { createDailyLog, getWeeklyLogs } = require('../controllers/logController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createDailyLog)
  .get(protect, getWeeklyLogs);

module.exports = router;