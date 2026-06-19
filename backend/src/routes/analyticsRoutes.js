const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

router.get('/stats', protect, (req, res) => {
  res.json({
    totalAssets: 12,
    totalAlerts: 5,
    riskScore: 65,
    severityDistribution: [
      { name: 'High', value: 2 },
      { name: 'Medium', value: 2 },
      { name: 'Low', value: 1 }
    ]
  });
});

module.exports = router;
