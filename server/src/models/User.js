const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false }, // Google login walo ka password nahi hoga
    
    // Auth Fields
    googleId: { type: String }, // For Google Login
    authProvider: { type: String, default: 'local' }, // 'local' or 'google'
    isVerified: { type: Boolean, default: false }, // Email verification status
    verificationToken: { type: String }, // Token for email link

    // Profile Stats
    age: { type: Number },
    height: { type: Number }, 
    weight: { type: Number }, 
    goal: { type: String, default: 'General Fitness' },
    
    partners: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    partnerRequests: [{ 
      sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      status: { type: String, default: 'pending' }
    }],
    
    // Gamification Stats
    gamification: {
      xp: { type: Number, default: 0 },
      level: { type: Number, default: 1 },
      streak: { type: Number, default: 0 },
      lastLogDate: { type: Date },
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
  if (!this.password) return false; // Google users won't have password
  return await bcrypt.compare(enteredPassword, this.password);
};

// Middleware to hash password
userSchema.pre('save', async function () {
  // [FIX] Removed 'next' parameter
  if (!this.isModified('password') || !this.password) {
    return; // Just return (promise resolves automatically)
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  // No need to call next()
});

module.exports = mongoose.model('User', userSchema);