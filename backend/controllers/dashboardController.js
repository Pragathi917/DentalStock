const Inventory = require('../models/Inventory');
const UsageHistory = require('../models/UsageHistory');
const { getInventoryStatus } = require('../utils/inventoryStatus');

// @desc    Get dashboard summary statistics
// @route   GET /api/dashboard
// @access  Authenticated (Admin/Staff)
const getDashboardStats = async (req, res, next) => {
  try {
    const items = await Inventory.find({});
    
    let totalItems = items.length;
    let lowStockItems = 0;
    let expiringSoonItems = 0;
    let expiredItems = 0;
    let totalInventoryValue = 0;
    
    const categoryStats = {};

    items.forEach(item => {
      const status = getInventoryStatus(item.quantity, item.minimumStock, item.expiryDate);
      
      if (status === 'EXPIRED') {
        expiredItems++;
      } else if (status === 'LOW_AND_EXPIRING') {
        lowStockItems++;
        expiringSoonItems++;
      } else if (status === 'LOW_STOCK') {
        lowStockItems++;
      } else if (status === 'EXPIRING_SOON') {
        expiringSoonItems++;
      }

      const itemValue = item.quantity * item.price;
      totalInventoryValue += itemValue;

      // Calculate category distribution
      if (!categoryStats[item.category]) {
        categoryStats[item.category] = { count: 0, value: 0 };
      }
      categoryStats[item.category].count++;
      categoryStats[item.category].value = Number((categoryStats[item.category].value + itemValue).toFixed(2));
    });

    // Get historical usage log summaries
    const usageLogs = await UsageHistory.find({}).sort({ date: 1 });
    const monthlyUsageSummary = {};
    
    usageLogs.forEach(log => {
      const logDate = new Date(log.date);
      if (isNaN(logDate.getTime())) return;
      const year = logDate.getFullYear();
      const month = String(logDate.getMonth() + 1).padStart(2, '0');
      const monthKey = `${year}-${month}`;
      monthlyUsageSummary[monthKey] = (monthlyUsageSummary[monthKey] || 0) + log.quantityUsed;
    });

    // Format usage log charts (limit to last 6 months)
    const usageChartData = Object.keys(monthlyUsageSummary)
      .map(month => ({
        month,
        quantity: monthlyUsageSummary[month]
      }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6);

    res.status(200).json({
      success: true,
      message: 'Dashboard statistics retrieved successfully',
      data: {
        totalItems,
        lowStockItems,
        expiringSoonItems,
        expiredItems,
        totalInventoryValue: Number(totalInventoryValue.toFixed(2)),
        categoryStats,
        usageChartData,
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardStats };
