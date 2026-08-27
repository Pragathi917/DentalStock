const express = require('express');
const { getAlerts } = require('../controllers/alertController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, getAlerts);

module.exports = router;
