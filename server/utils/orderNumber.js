import CustomOrder from '../models/CustomOrder.js';

export const generateOrderNumber = async () => {
  const currentYear = new Date().getFullYear();
  const prefix = `ART-${currentYear}-`;

  // Find latest order for current year
  const latestOrder = await CustomOrder.findOne({
    orderNumber: new RegExp(`^${prefix}`)
  }).sort({ createdAt: -1 });

  let sequence = 1;
  if (latestOrder && latestOrder.orderNumber) {
    const parts = latestOrder.orderNumber.split('-');
    if (parts.length === 3) {
      const lastSeq = parseInt(parts[2], 10);
      if (!isNaN(lastSeq)) {
        sequence = lastSeq + 1;
      }
    }
  }

  const paddedSeq = String(sequence).padStart(4, '0');
  return `${prefix}${paddedSeq}`;
};
