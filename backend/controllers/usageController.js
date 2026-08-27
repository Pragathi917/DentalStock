const mongoose = require('mongoose');
const UsageHistory = require('../models/UsageHistory');
const Inventory = require('../models/Inventory');

// @desc    Record inventory usage
// @route   POST /api/usage
// @access  Authenticated (Admin/Staff)
const recordUsage = async (req, res, next) => {
  try {
    const { inventoryId, quantityUsed, purpose, date } = req.body;

    if (!inventoryId || quantityUsed === undefined || !purpose) {
      res.status(400);
      throw new Error('Please provide inventoryId, quantityUsed and purpose');
    }

    if (!mongoose.Types.ObjectId.isValid(inventoryId)) {
      res.status(400);
      throw new Error('Invalid inventory ID format');
    }

    const qty = Number(quantityUsed);
    if (isNaN(qty) || qty <= 0) {
      res.status(400);
      throw new Error('Quantity used must be a positive number greater than zero');
    }

    // Find the inventory item
    const item = await Inventory.findById(inventoryId);
    if (!item) {
      res.status(404);
      throw new Error('Inventory item not found');
    }

    // Check if enough stock is available
    if (item.quantity < qty) {
      res.status(400);
      throw new Error(`Insufficient stock. Current stock is ${item.quantity}, but requested ${qty}`);
    }

    // Decrease inventory stock
    item.quantity -= qty;
    await item.save();

    // Create the usage history record
    const usage = await UsageHistory.create({
      inventoryId,
      itemName: item.name,
      quantityUsed: qty,
      purpose,
      date: date ? new Date(date) : new Date(),
      recordedBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Usage recorded successfully',
      data: {
        usage,
        updatedInventory: {
          id: item._id,
          name: item.name,
          quantity: item.quantity,
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all usage logs with optional filters
// @route   GET /api/usage
// @access  Authenticated (Admin/Staff)
const getUsageHistory = async (req, res, next) => {
  try {
    const { item, startDate, endDate } = req.query;

    const query = {};

    if (item) {
      query.itemName = { $regex: item, $options: 'i' };
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        // To include full day for endDate, set time to end of day
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    const logs = await UsageHistory.find(query)
      .populate('recordedBy', 'name email role')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      message: 'Usage logs retrieved successfully',
      data: logs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get usage logs for a single inventory item
// @route   GET /api/usage/:inventoryId
// @access  Authenticated (Admin/Staff)
const getUsageHistoryByInventory = async (req, res, next) => {
  try {
    const { inventoryId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(inventoryId)) {
      res.status(400);
      throw new Error('Invalid inventory ID format');
    }

    const logs = await UsageHistory.find({ inventoryId })
      .populate('recordedBy', 'name email role')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      message: 'Usage logs for inventory item retrieved successfully',
      data: logs,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  recordUsage,
  getUsageHistory,
  getUsageHistoryByInventory,
};
