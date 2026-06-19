const express = require('express');
const router = express.Router();
const { getAdvisories, getCompliance } = require('../controllers/intelligenceController');
const { protect } = require('../middleware/authMiddleware');

router.get('/advisories', getAdvisories);
router.get('/compliance', protect, getCompliance);

module.exports = router;
