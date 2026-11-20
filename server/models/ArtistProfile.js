import mongoose from 'mongoose';

const artistProfileSchema = new mongoose.Schema({
  artistName: {
    type: String,
    default: 'Chulbul'
  },
  shortBio: {
    type: String,
    default: 'Self-taught visual artist specializing in hyper-realistic pencil sketch portraits, vibrant watercolors, and expressive oil paintings.'
  },
  story: {
    type: String,
    default: 'My artistic journey began with simple graphite pencils and sketchbooks filled with faces from old photographs. Over the years, that childhood curiosity blossomed into an obsession with light, texture, and emotional depth. Today, I create custom commissioned pieces that bridge memory and fine art for collectors across India.'
  },
  philosophy: {
    type: String,
    default: 'A true portrait is never just an accurate copy of a photograph—it is an intimate translation of feeling. I believe every commissioned painting should carry the warmth, breath, and sentiment of the person or moment it captures.'
  },
  skillsMediums: [{
    name: { type: String, required: true },
    experienceLevel: { type: String, default: 'Master' },
    description: { type: String, default: '' }
  }],
  experienceTimeline: [{
    year: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true }
  }],
  achievements: [{
    year: { type: String, required: true },
    title: { type: String, required: true },
    organization: { type: String, default: '' }
  }],
  processSteps: [{
    stepNumber: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true }
  }],
  photo: {
    url: { type: String, default: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80' },
    publicId: { type: String, default: '' }
  },
  avatarIllustration: {
    url: { type: String, default: '' },
    publicId: { type: String, default: '' }
  }
}, {
  timestamps: true
});

const ArtistProfile = mongoose.model('ArtistProfile', artistProfileSchema);
export default ArtistProfile;
