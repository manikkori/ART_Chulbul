import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CustomOrder',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    trim: true,
    default: ''
  },
  attachments: [{
    url: { type: String, required: true },
    publicId: { type: String, default: '' },
    name: { type: String, default: '' },
    mimeType: { type: String, default: '' }
  }],
  readBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

messageSchema.index({ order: 1, createdAt: 1 });

const Message = mongoose.model('Message', messageSchema);
export default Message;
