const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto'); // Built-in node module
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const generateToken = require('../utils/tokenGenerator');
const emailService = require('../services/emailService');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// 1. REGISTER USER (Local)
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    // Generate Verification Token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = await User.create({
      name,
      email,
      password,
      verificationToken,
      isVerified: false
    });

    if (user) {
      // Send Email
      await emailService.sendVerificationEmail(user.email, verificationToken);
      
      res.status(201).json({
        message: 'Account created! Please check your email to verify account.',
        // No token returned here, forcing them to verify first
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. VERIFY EMAIL
const verifyEmail = async (req, res) => {
  const { token } = req.body;
  try {
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Verify User
    user.isVerified = true;
    user.verificationToken = undefined; // Clear token
    await user.save();

    // Send Welcome Email
    await emailService.sendWelcomeEmail(user.email, user.name);

    // Login the user directly after verification
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
      message: 'Email verified successfully!'
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. LOGIN USER (Local)
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      // Check if verified
      if (!user.isVerified && user.authProvider === 'local') {
        return res.status(401).json({ message: 'Please verify your email first.' });
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || 'user',
        token: generateToken(user._id),
        // Send profile data
        age: user.age,
        height: user.height,
        weight: user.weight,
        goal: user.goal
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. GOOGLE LOGIN
// 4. GOOGLE LOGIN
const googleAuth = async (req, res) => {
  const { token } = req.body;
  
  try {
    // Verify Google Token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const { email, sub: googleId, picture } = payload;
    
    // [FIX] Robust Name Handling
    // Try 'name', then 'given_name', then fallback to email prefix
    let name = payload.name;
    if (!name) {
      if (payload.given_name) {
        name = `${payload.given_name} ${payload.family_name || ''}`.trim();
      } else {
        name = email.split('@')[0]; // Fallback: use part before @gmail.com
      }
    }

    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      // If user exists, link Google ID if missing
      if (!user.googleId) {
        user.googleId = googleId;
        user.authProvider = 'google'; 
        user.isVerified = true; 
        
        // Ensure name is not empty in DB before saving
        if (!user.name) user.name = name; 
        
        await user.save();
      }
    } else {
      // Create new user
      user = await User.create({
        name, // Now guaranteed to have a value
        email,
        googleId,
        authProvider: 'google',
        isVerified: true, 
        password: crypto.randomBytes(16).toString('hex') 
      });

      // Send Welcome Email
      await emailService.sendWelcomeEmail(user.email, user.name);
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
      // Add profile fields if needed
      age: user.age,
      height: user.height,
      weight: user.weight,
      goal: user.goal
    });

  } catch (error) {
    console.error("Google Auth Error Details:", error); // Better debugging
    res.status(400).json({ message: 'Google Authentication Failed: ' + error.message });
  }
};

// 5. Update Profile
const updateUserProfile = async (req, res) => {
  // ... (Tumhara purana code same rahega) ...
  try {
      const user = await User.findById(req.user._id);
      if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.age = req.body.age || user.age;
        user.height = req.body.height || user.height;
        user.weight = req.body.weight || user.weight;
        user.goal = req.body.goal || user.goal;
        if (req.body.password) user.password = req.body.password;
  
        const updatedUser = await user.save();
        res.json({
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          token: generateToken(updatedUser._id),
          // Return updated profile data
          age: updatedUser.age, height: updatedUser.height, weight: updatedUser.weight, goal: updatedUser.goal
        });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

const submitContactForm = async (req, res) => {
  const { firstName, lastName, email, message } = req.body;

  try {
    const fullName = `${firstName} ${lastName}`;
    
    // Email Service ko call karo
    await emailService.sendSupportEmail(fullName, email, message);

    res.status(200).json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error("Contact Form Error:", error);
    res.status(500).json({ message: 'Failed to send message.' });
  }
};

module.exports = { registerUser, loginUser, googleAuth, verifyEmail, updateUserProfile,submitContactForm };