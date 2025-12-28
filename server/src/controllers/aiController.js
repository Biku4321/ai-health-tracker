const {
  generateHealthInsight,
  analyzeJournalEntry,
  streamGeminiResponse,
  analyzeImageContent,
  analyzeAudioContent,
} = require("../services/ai-engine/geminiService");

// @desc    Get AI Chat/Insight
// @route   POST /api/ai/chat
// @access  Private
const getAIChatResponse = async (req, res) => {
  const { message } = req.body;
  try {
    // Pass user ID so AI knows who it's talking to
    const aiResponse = await generateHealthInsight(req.user._id, message);
    res.json({ response: aiResponse });
  } catch (error) {
    res.status(500).json({ message: "AI is taking a nap. Try again later." });
  }
};

// @desc    Analyze Journal (Called automatically when saving a journal)
// @route   POST /api/ai/analyze-journal
// @access  Private
const analyzeJournal = async (req, res) => {
  const { text } = req.body;
  try {
    const analysis = await analyzeJournalEntry(text);
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ message: "Analysis failed" });
  }
};
// @desc    Analyze uploaded food image
// @route   POST /api/ai/analyze-food
const analyzeFoodImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    // req.file.buffer comes from multer memory storage
    const analysis = await analyzeImageContent(
      req.file.buffer,
      req.file.mimetype
    );

    res.json(analysis);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Image analysis failed" });
  }
};
// @desc    Analyze Voice Log
// @route   POST /api/ai/analyze-voice
const analyzeVoiceLog = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No audio uploaded" });
    }

    // Gemini supports audio/mp3, audio/wav, audio/webm, etc.
    const analysis = await analyzeAudioContent(
      req.file.buffer,
      req.file.mimetype
    );
    res.json(analysis);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Voice analysis failed" });
  }
};
module.exports = {
  getAIChatResponse,
  analyzeJournal,
  analyzeFoodImage,
  analyzeVoiceLog,
};
