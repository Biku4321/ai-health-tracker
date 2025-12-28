const User = require('../models/User');

// @desc    Get Global Leaderboard (Top 10 by XP)
// @route   GET /api/community/leaderboard
const getLeaderboard = async (req, res) => {
  try {
    const leaders = await User.find({})
      .sort({ 'gamification.xp': -1 })
      .limit(10)
      .select('name gamification.xp gamification.level gamification.streak');
    res.json(leaders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send Partner Request
// @route   POST /api/community/partner/invite
const sendPartnerRequest = async (req, res) => {
  const { email } = req.body;
  try {
    const targetUser = await User.findOne({ email });
    if (!targetUser) return res.status(404).json({ message: 'User not found' });
    if (targetUser._id.equals(req.user._id)) return res.status(400).json({ message: "Can't add yourself" });

    // Check if already partners or requested
    if (targetUser.partners.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already partners' });
    }

    // Add request
    targetUser.partnerRequests.push({ sender: req.user._id, status: 'pending' });
    await targetUser.save();

    res.json({ message: 'Invitation sent!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Accept Partner Request
// @route   POST /api/community/partner/accept
const acceptPartnerRequest = async (req, res) => {
  const { requestId } = req.body; // sender userId
  try {
    const user = await User.findById(req.user._id);
    const sender = await User.findById(requestId);

    if (!user || !sender) return res.status(404).json({ message: 'User not found' });

    // Add to both partner lists
    user.partners.push(sender._id);
    sender.partners.push(user._id);
    
    // Remove request
    user.partnerRequests = user.partnerRequests.filter(r => !r.sender.equals(sender._id));

    await user.save();
    await sender.save();

    res.json({ message: 'Partner connected!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get My Partners
// @route   GET /api/community/partners
const getMyPartners = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('partners', 'name gamification.streak gamification.level email')
      .populate('partnerRequests.sender', 'name email');
    
    res.json({
      partners: user.partners,
      requests: user.partnerRequests
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getLeaderboard, sendPartnerRequest, acceptPartnerRequest, getMyPartners };