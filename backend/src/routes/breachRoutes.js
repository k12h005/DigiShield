const express = require('express');
const router = express.Router();
const { 
  getAllBreaches, 
  getBreachByName, 
  getAnalytics, 
  getDashboard 
} = require('../controllers/breachController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getAllBreaches);
router.get('/analytics', getAnalytics);
router.get('/dashboard', getDashboard);
router.get('/:name', getBreachByName);

module.exports = router;
