const express = require('express');
const {
  recordUsage,
  getUsageHistory,
  getUsageHistoryByInventory
} = require('../controllers/usageController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Apply auth protection middleware to all usage routes
router.use(protect);

router.route('/')
  .post(recordUsage)
  .get(getUsageHistory);

router.route('/:inventoryId')
  .get(getUsageHistoryByInventory);

module.exports = router;
