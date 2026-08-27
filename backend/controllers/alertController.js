const Inventory = require('../models/Inventory');
const UsageHistory = require('../models/UsageHistory');
const { getInventoryStatus } = require('../utils/inventoryStatus');
const { calculateMovingAverageForecast } = require('../utils/forecast');

// @desc    Get dynamic alerts for inventory
// @route   GET /api/alerts
// @access  Authenticated (Admin/Staff)
const getAlerts = async (req, res, next) => {
  try {
    const items = await Inventory.find({});
    const allLogs = await UsageHistory.find({});

    // Group logs by inventoryId for quick lookup
    const logsByItem = {};
    allLogs.forEach(log => {
      const key = log.inventoryId.toString();
      if (!logsByItem[key]) logsByItem[key] = [];
      logsByItem[key].push(log);
    });

    const lowStock = [];
    const expiringSoon = [];
    const expired = [];
    const forecastWarnings = [];

    items.forEach(item => {
      const status = getInventoryStatus(item.quantity, item.minimumStock, item.expiryDate);

      const formattedItem = {
        id: item._id,
        name: item.name,
        quantity: item.quantity,
        minimumStock: item.minimumStock,
        expiryDate: item.expiryDate,
        category: item.category,
      };

      if (status === 'EXPIRED') {
        expired.push(formattedItem);
      } else if (status === 'LOW_AND_EXPIRING') {
        lowStock.push(formattedItem);
        expiringSoon.push(formattedItem);
      } else if (status === 'LOW_STOCK') {
        lowStock.push(formattedItem);
      } else if (status === 'EXPIRING_SOON') {
        expiringSoon.push(formattedItem);
      }

      // Check forecasts for potential shortage warnings
      const logs = logsByItem[item._id.toString()] || [];
      if (logs.length > 0) {
        const forecast = calculateMovingAverageForecast(logs, item.quantity);
        if (forecast && forecast.status === 'POTENTIAL_SHORTAGE') {
          forecastWarnings.push({
            inventoryId: item._id,
            itemName: item.name,
            currentStock: item.quantity,
            predictedDemand: forecast.predictedDemand,
            recommendedOrder: forecast.recommendedOrder,
          });
        }
      }
    });

    res.status(200).json({
      success: true,
      message: 'Alerts retrieved successfully',
      data: {
        lowStock,
        expiringSoon,
        expired,
        forecastWarnings,
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAlerts };
