const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, (req, res) => {
  res.json([
    {
      id: '1',
      asset: 'user@example.com',
      source: 'LinkedIn 2024',
      severity: 'High',
      date: '2024-10-12',
      status: 'pending'
    }
  ]);
});

module.exports = router;
