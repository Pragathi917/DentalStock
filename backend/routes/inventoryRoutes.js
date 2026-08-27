const express = require('express');
const {
  getInventory,
  getInventoryById,
  createInventory,
  updateInventory,
  deleteInventory
} = require('../controllers/inventoryController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

const router = express.Router();

// Apply auth protection middleware to all inventory routes
router.use(protect);

router.route('/')
  .get(getInventory)
  .post(authorizeRoles('admin'), createInventory);

router.route('/:id')
  .get(getInventoryById)
  .put(authorizeRoles('admin'), updateInventory)
  .delete(authorizeRoles('admin'), deleteInventory);

module.exports = router;
