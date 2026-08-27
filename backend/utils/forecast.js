/**
 * Calculates moving average forecast based on usage logs and current stock level.
 * 
 * @param {Array} usageLogs - Array of usage history logs
 * @param {Number} currentStock - Current quantity in stock
 * @param {Number} monthsLimit - Number of months to consider for moving average (default: 3)
 */
const calculateMovingAverageForecast = (usageLogs, currentStock, monthsLimit = 3) => {
  if (!usageLogs || usageLogs.length === 0) {
    return null;
  }

  // Group usage logs by YYYY-MM
  const monthlyUsage = {};
  
  usageLogs.forEach(log => {
    const logDate = new Date(log.date);
    if (isNaN(logDate.getTime())) return; // skip invalid dates

    const year = logDate.getFullYear();
    const month = String(logDate.getMonth() + 1).padStart(2, '0');
    const monthKey = `${year}-${month}`;

    monthlyUsage[monthKey] = (monthlyUsage[monthKey] || 0) + log.quantityUsed;
  });

  // Get sorted list of months in descending order (latest month first)
  const sortedMonths = Object.keys(monthlyUsage)
    .map(month => ({
      month,
      quantity: monthlyUsage[month]
    }))
    .sort((a, b) => b.month.localeCompare(a.month));

  if (sortedMonths.length === 0) {
    return null;
  }

  // Get the latest N months (e.g. 3 months)
  const latestMonths = sortedMonths.slice(0, monthsLimit);
  const sum = latestMonths.reduce((total, m) => total + m.quantity, 0);
  const averageMonthlyUsage = Number((sum / latestMonths.length).toFixed(2));
  
  const predictedDemand = Math.round(averageMonthlyUsage);
  const recommendedOrder = Math.max(0, predictedDemand - currentStock);
  const status = currentStock >= predictedDemand ? 'SUFFICIENT_STOCK' : 'POTENTIAL_SHORTAGE';

  // Return chronological historical usage logs (oldest first for display)
  const chronologicalUsage = [...sortedMonths].reverse();

  return {
    averageMonthlyUsage,
    predictedDemand,
    recommendedOrder,
    status,
    historicalUsage: chronologicalUsage
  };
};

module.exports = { calculateMovingAverageForecast };
