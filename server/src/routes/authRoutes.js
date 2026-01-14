const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  googleAuth, 
  verifyEmail, 
    updateUserProfile, 
  submitContactForm
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.post('/google', googleAuth); // New Google Route
router.post('/verify-email', verifyEmail); // New Verify Route
router.put('/profile', protect, updateUserProfile);
router.post('/contact', submitContactForm);
module.exports = router;