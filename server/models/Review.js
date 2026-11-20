import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  artwork: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artwork'
  },
  customOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CustomOrder'
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: [true, 'Review comment is required'],
    trim: true,
    maxlength: [1000, 'Comment cannot exceed 1000 characters']
  },
  photo: {
    url: { type: String, default: '' },
    publicId: { type: String, default: '' }
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  showOnHome: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

reviewSchema.index({ customer: 1 });
reviewSchema.index({ artwork: 1, isApproved: 1 });
reviewSchema.index({ isApproved: 1, showOnHome: 1 });

const Review = mongoose.model('Review', reviewSchema);
export default Review;
