// const express = require('express');
// const router = express.Router();
// const { syncWearableData } = require('../controllers/integrationController');
// const { protect } = require('../middleware/authMiddleware');

// router.post('/sync', protect, syncWearableData);

// module.exports = router;
const express = require('express');
const router = express.Router();
const { syncWearableData } = require('../controllers/integrationController');
const { protect } = require('../middleware/authMiddleware');

router.post('/sync', protect, syncWearableData);

module.exports = router;