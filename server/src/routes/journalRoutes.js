const express = require('express');
const router = express.Router();
const { createJournal, getJournals } = require('../controllers/journalController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createJournal)
  .get(protect, getJournals);

module.exports = router;