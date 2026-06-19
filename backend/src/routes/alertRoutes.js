const express = require('express');
const router = express.Router();
const { getAlerts, updateAlertStatus } = require('../controllers/alertController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/', getAlerts);
router.patch('/:id', updateAlertStatus);

module.exports = router;
