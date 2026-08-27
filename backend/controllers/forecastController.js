const mongoose = require('mongoose');
const Inventory = require('../models/Inventory');
const UsageHistory = require('../models/UsageHistory');
const { calculateMovingAverageForecast } = require('../utils/forecast');

// @desc    Get moving average demand forecast for an item
// @route   GET /api/forecast/:inventoryId
// @access  Authenticated (Admin/Staff)
const getForecast = async (req, res, next) => {
  try {
    const { inventoryId } = req.params;
    const monthsLimit = parseInt(req.query.months) || 3;

    if (!mongoose.Types.ObjectId.isValid(inventoryId)) {
      res.status(400);
      throw new Error('Invalid inventory ID format');
    }

    const item = await Inventory.findById(inventoryId);
    if (!item) {
      res.status(404);
      throw new Error('Inventory item not found');
    }

    // Get historical usage logs for this item
    const logs = await UsageHistory.find({ inventoryId }).sort({ date: -1 });

    const forecastResult = calculateMovingAverageForecast(logs, item.quantity, monthsLimit);

    if (!forecastResult) {
      return res.status(200).json({
        success: true,
        message: 'No historical usage data available for forecasting.',
        data: {
          inventoryId: item._id,
          itemName: item.name,
          currentStock: item.quantity,
          averageMonthlyUsage: 0,
          predictedDemand: 0,
          recommendedOrder: 0,
          status: 'NO_DATA',
          historicalUsage: []
        }
      });
    }

    res.status(200).json({
      success: true,
      message: 'Forecast retrieved successfully',
      data: {
        inventoryId: item._id,
        itemName: item.name,
        currentStock: item.quantity,
        ...forecastResult,
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getForecast };
