export const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '-';
  
  // Format as e.g. 27 Aug 2026
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  // Using English UK locale gives '27 Aug 2026' formatting
  return date.toLocaleDateString('en-GB', options);
};
