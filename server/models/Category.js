import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true,
    trim: true,
    maxlength: [80, 'Category name cannot exceed 80 characters']
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
    trim: true,
    default: ''
  },
  image: {
    url: { type: String, default: '' },
    publicId: { type: String, default: '' }
  },
  startingPrice: {
    type: Number,
    default: 0
  },
  displayOrder: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

categorySchema.index({ displayOrder: 1, isActive: 1 });

const Category = mongoose.model('Category', categorySchema);
export default Category;
