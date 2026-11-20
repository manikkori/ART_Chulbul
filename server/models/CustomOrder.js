import mongoose from 'mongoose';

const customOrderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  medium: {
    type: String,
    required: true
  },
  size: {
    type: String,
    required: true
  },
  referenceImages: [{
    url: { type: String, required: true },
    publicId: { type: String, default: '' },
    originalName: { type: String, default: '' }
  }],
  description: {
    type: String,
    required: [true, 'Artwork description is required']
  },
  preferences: {
    subjectsCount: { type: Number, default: 1 },
    background: { type: String, default: 'Artist choice / natural' },
    colors: { type: String, default: '' },
    specialInstructions: { type: String, default: '' }
  },
  deadline: {
    type: Date
  },
  addressSnapshot: {
    recipientName: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, default: 'India' }
  },
  quote: {
    amount: { type: Number, default: null }, // Price in INR
    estimatedDays: { type: Number, default: null },
    note: { type: String, default: '' },
    sentAt: { type: Date, default: null },
    acceptedAt: { type: Date, default: null },
    declinedAt: { type: Date, default: null },
    declinedReason: { type: String, default: '' }
  },
  status: {
    type: String,
    enum: [
      'Pending Review',
      'Quoted',
      'Accepted',
      'In Progress',
      'Completed',
      'Shipped',
      'Delivered',
      'Declined',
      'Rejected',
      'Cancelled'
    ],
    default: 'Pending Review'
  },
  statusHistory: [{
    status: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    note: { type: String, default: '' },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  progressUpdates: [{
    image: {
      url: { type: String, required: true },
      publicId: { type: String, default: '' }
    },
    caption: { type: String, default: '' },
    date: { type: Date, default: Date.now }
  }],
  shipping: {
    courier: { type: String, default: '' },
    trackingNumber: { type: String, default: '' },
    trackingUrl: { type: String, default: '' },
    shippedAt: { type: Date, default: null },
    deliveredAt: { type: Date, default: null }
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid'],
    default: 'pending'
  },
  adminNotes: {
    type: String,
    default: ''
  },
  rejectionReason: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

customOrderSchema.index({ customer: 1, createdAt: -1 });
customOrderSchema.index({ status: 1 });
customOrderSchema.index({ createdAt: -1 });

const CustomOrder = mongoose.model('CustomOrder', customOrderSchema);
export default CustomOrder;
