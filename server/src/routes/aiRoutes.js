const express = require('express');
const router = express.Router();
const { getAIChatResponse, analyzeJournal } = require('../controllers/aiController');
const { analyzeVoiceLog } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const { analyzeFoodImage } = require('../controllers/aiController');
router.post('/chat', protect, getAIChatResponse); // Fallback HTTP
router.post('/analyze-journal', protect, analyzeJournal);
router.post('/analyze-voice', protect, upload.single('audio'), analyzeVoiceLog);
router.post('/analyze-food', protect, upload.single('image'), analyzeFoodImage);
module.exports = router;