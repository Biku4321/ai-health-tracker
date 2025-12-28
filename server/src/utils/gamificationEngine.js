const User = require('../models/User');

const BADGES = [
  { id: 'first_step', name: 'First Step', icon: '🌱', description: 'Logged your first entry', threshold: 1 },
  { id: 'streak_3', name: 'On Fire', icon: '🔥', description: '3 Day Streak', threshold: 3 },
  { id: 'streak_7', name: 'Unstoppable', icon: '🚀', description: '7 Day Streak', threshold: 7 },
  { id: 'master_logger', name: 'Data Wizard', icon: '🧙‍♂️', description: 'Logged 10+ entries', threshold: 10 }
];

const processGamification = async (userId) => {
  const user = await User.findById(userId);
  if (!user) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastLog = user.gamification.lastLogDate ? new Date(user.gamification.lastLogDate) : null;
  if (lastLog) lastLog.setHours(0, 0, 0, 0);

  // 1. Calculate Streak
  let newStreak = user.gamification.streak;
  
  if (!lastLog) {
    newStreak = 1; // First log ever
  } else {
    const diffTime = Math.abs(today - lastLog);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      newStreak += 1; // Consecutive day
    } else if (diffDays > 1) {
      newStreak = 1; // Broken streak
    }
    // If diffDays === 0, they logged twice in same day, do nothing to streak
  }

  // 2. Award XP (50 XP per log)
  const xpGained = 50;
  let currentXp = user.gamification.xp + xpGained;
  let currentLevel = user.gamification.level;

  // Level Up Logic (Level = XP / 100)
  const xpNeeded = currentLevel * 100;
  let leveledUp = false;
  if (currentXp >= xpNeeded) {
    currentLevel += 1;
    currentXp = currentXp - xpNeeded; // Rollover XP
    leveledUp = true;
  }

  // 3. Check Badges
  const newBadges = [];
  const existingBadgeIds = user.gamification.badges.map(b => b.id);

  // Streak Badges
  BADGES.forEach(badge => {
    if (badge.id.startsWith('streak_') && newStreak >= badge.threshold && !existingBadgeIds.includes(badge.id)) {
      newBadges.push(badge);
    }
    // Simple logic: "First Step" on streak 1
    if (badge.id === 'first_step' && newStreak >= 1 && !existingBadgeIds.includes(badge.id)) {
      newBadges.push(badge);
    }
  });

  // Update User
  user.gamification.streak = newStreak;
  user.gamification.xp = currentXp;
  user.gamification.level = currentLevel;
  user.gamification.lastLogDate = Date.now();
  user.gamification.badges.push(...newBadges);

  await user.save();

  return {
    streak: newStreak,
    level: currentLevel,
    xp: currentXp,
    leveledUp,
    newBadges
  };
};

module.exports = { processGamification };