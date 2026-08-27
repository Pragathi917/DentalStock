/**
 * Calculates the inventory status based on quantity, minimum stock, and expiry date.
 * 
 * Possible status values:
 * - EXPIRED: expiry date is before today's date
 * - LOW_AND_EXPIRING: both low stock and expiring soon (within next 30 days) apply
 * - LOW_STOCK: quantity <= minimumStock
 * - EXPIRING_SOON: expiry date is within the next 30 days
 * - GOOD: none of the above
 */
const getInventoryStatus = (quantity, minimumStock, expiryDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);

  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(today.getDate() + 30);
  thirtyDaysFromNow.setHours(23, 59, 59, 999);

  const isExpired = expiry < today;
  const isExpiringSoon = expiry >= today && expiry <= thirtyDaysFromNow;
  const isLowStock = quantity <= minimumStock;

  if (isExpired) {
    return 'EXPIRED';
  }
  if (isLowStock && isExpiringSoon) {
    return 'LOW_AND_EXPIRING';
  }
  if (isLowStock) {
    return 'LOW_STOCK';
  }
  if (isExpiringSoon) {
    return 'EXPIRING_SOON';
  }
  return 'GOOD';
};

module.exports = { getInventoryStatus };
