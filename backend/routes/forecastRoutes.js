const express = require('express');
const { getForecast } = require('../controllers/forecastController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/:inventoryId')
  .get(protect, getForecast);

module.exports = router;
