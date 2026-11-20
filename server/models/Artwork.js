import mongoose from 'mongoose';

const artworkImageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  publicId: { type: String, default: '' },
  caption: { type: String, default: '' },
  isCover: { type: Boolean, default: false }
}, { _id: true });

const artworkSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Artwork title is required'],
    trim: true,
    maxlength: [120, 'Title cannot exceed 120 characters']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  medium: {
    type: String,
    required: [true, 'Medium is required'],
    trim: true
  },
  dimensions: {
    type: String,
    required: [true, 'Dimensions are required'], // e.g. "12 x 16 inches", "A3 (29.7 x 42 cm)"
    trim: true
  },
  timeTaken: {
    type: String, // e.g. "18 hours across 4 days"
    default: ''
  },
  startingPrice: {
    type: Number,
    required: [true, 'Starting price is required'],
    min: [0, 'Price must be positive']
  },
  images: [artworkImageSchema],
  coverImage: {
    url: { type: String, required: true },
    publicId: { type: String, default: '' }
  },
  tags: [{
    type: String,
    trim: true
  }],
  isFeatured: {
    type: Boolean,
    default: false
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  viewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

artworkSchema.index({ category: 1, isPublished: 1 });
artworkSchema.index({ isFeatured: 1, isPublished: 1 });
artworkSchema.index({ createdAt: -1 });

const Artwork = mongoose.model('Artwork', artworkSchema);
export default Artwork;
