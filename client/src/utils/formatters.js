/**
 * Format price in INR using Indian numbering system (e.g. ₹2,999)
 */
export const formatPrice = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Format date string into human friendly format
 */
export const formatDate = (dateString, includeTime = false) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  const options = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...(includeTime && { hour: '2-digit', minute: '2-digit' })
  };
  return includeTime ? date.toLocaleString('en-IN', options) : date.toLocaleDateString('en-IN', options);
};

/**
 * Status color classes and icons mapping
 */
export const getStatusBadgeStyle = (status) => {
  switch (status) {
    case 'Pending Review':
      return {
        bg: 'bg-amber-50 text-amber-700 border-amber-200',
        dot: 'bg-amber-500',
        label: 'Pending Review'
      };
    case 'Quoted':
      return {
        bg: 'bg-blue-50 text-blue-700 border-blue-200',
        dot: 'bg-blue-500',
        label: 'Quote Received'
      };
    case 'Accepted':
      return {
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        dot: 'bg-emerald-500',
        label: 'Quote Accepted'
      };
    case 'In Progress':
      return {
        bg: 'bg-purple-50 text-purple-700 border-purple-200',
        dot: 'bg-purple-500',
        label: 'In Progress (Painting)'
      };
    case 'Completed':
      return {
        bg: 'bg-teal-50 text-teal-700 border-teal-200',
        dot: 'bg-teal-500',
        label: 'Artwork Completed'
      };
    case 'Shipped':
      return {
        bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        dot: 'bg-indigo-500',
        label: 'Shipped'
      };
    case 'Delivered':
      return {
        bg: 'bg-green-50 text-green-700 border-green-200',
        dot: 'bg-green-500',
        label: 'Delivered'
      };
    case 'Declined':
      return {
        bg: 'bg-gray-50 text-gray-700 border-gray-200',
        dot: 'bg-gray-400',
        label: 'Quote Declined'
      };
    case 'Rejected':
      return {
        bg: 'bg-rose-50 text-rose-700 border-rose-200',
        dot: 'bg-rose-500',
        label: 'Rejected'
      };
    case 'Cancelled':
      return {
        bg: 'bg-rose-50 text-rose-700 border-rose-200',
        dot: 'bg-rose-500',
        label: 'Cancelled'
      };
    default:
      return {
        bg: 'bg-gray-50 text-gray-700 border-gray-200',
        dot: 'bg-gray-400',
        label: status || 'Pending'
      };
  }
};
