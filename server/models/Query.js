import mongoose from 'mongoose';

const queryReplySchema = new mongoose.Schema({
  senderRole: {
    type: String,
    enum: ['admin', 'customer'],
    required: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  sentAt: {
    type: Date,
    default: Date.now
  }
}, { _id: true });

const querySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide your email address'],
    lowercase: true,
    trim: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  subject: {
    type: String,
    required: [true, 'Please provide a subject'],
    trim: true
  },
  message: {
    type: String,
    required: [true, 'Please provide your message'],
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'resolved'],
    default: 'pending'
  },
  replies: [queryReplySchema]
}, {
  timestamps: true
});

querySchema.index({ email: 1 });
querySchema.index({ user: 1 });
querySchema.index({ status: 1, createdAt: -1 });

const Query = mongoose.model('Query', querySchema);
export default Query;
