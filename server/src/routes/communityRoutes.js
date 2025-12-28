const express = require('express');
const router = express.Router();
const { getLeaderboard, sendPartnerRequest, acceptPartnerRequest, getMyPartners } = require('../controllers/communityController');
const { protect } = require('../middleware/authMiddleware');

router.get('/leaderboard', protect, getLeaderboard);
router.get('/partners', protect, getMyPartners);
router.post('/partner/invite', protect, sendPartnerRequest);
router.post('/partner/accept', protect, acceptPartnerRequest);

module.exports = router;