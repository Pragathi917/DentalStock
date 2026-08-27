export const formatCurrency = (value) => {
  if (value === undefined || value === null) return '₹0.00';
  
  // Format as e.g. ₹5,000.00
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};
