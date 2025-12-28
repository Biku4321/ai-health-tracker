const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    
    // Profile Stats
    age: { type: Number },
    height: { type: Number }, // cm
    weight: { type: Number }, // kg
    goal: { type: String, default: 'General Fitness' },
    partners: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    partnerRequests: [{ 
      sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      status: { type: String, default: 'pending' } // pending, accepted
    }],
    // 🎮 Gamification Stats (NEW)
    gamification: {
      xp: { type: Number, default: 0 },
      level: { type: Number, default: 1 },
      streak: { type: Number, default: 0 },
      lastLogDate: { type: Date }, // To calculate streaks
      badges: [{
        id: String,
        name: String,
        icon: String, 
        description: String,
        earnedAt: { type: Date, default: Date.now }
      }]
    }
  },
  { timestamps: true }
);

// Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Middleware to hash password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', userSchema);