const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  getProfile, 
  logoutUser 
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post(
  '/register', 
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('firstName').notEmpty().withMessage('First name is required'),
  ],
  registerUser
);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/profile', protect, getProfile);

module.exports = router;
