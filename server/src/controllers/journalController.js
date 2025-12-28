const Journal = require("../models/Journal");

const createJournal = async (req, res) => {
  const { content, mood, sentimentScore, summary, advice } = req.body;
  try {
    const journal = await Journal.create({
      user: req.user._id,
      content,
      mood,
      sentimentScore,
      summary,
      advice,
    });
    res.status(201).json(journal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getJournals = async (req, res) => {
  try {
    const journals = await Journal.find({ user: req.user._id }).sort({
      date: -1,
    });
    res.json(journals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createJournal, getJournals };
