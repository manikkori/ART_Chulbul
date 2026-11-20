import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema({
  siteName: {
    type: String,
    default: "Chulbul's Art"
  },
  logo: {
    url: { type: String, default: '' },
    publicId: { type: String, default: '' }
  },
  favicon: {
    url: { type: String, default: '' },
    publicId: { type: String, default: '' }
  },
  heroTitle: {
    type: String,
    default: 'Handmade, Personalized Art Made Exclusively For You'
  },
  heroSubtitle: {
    type: String,
    default: 'Every brushstroke tells your story. Send us your reference photo, receive a custom quote, and watch your memories turn into timeless original art.'
  },
  heroImage: {
    url: { type: String, default: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80' },
    publicId: { type: String, default: '' }
  },
  heroCtaText: {
    type: String,
    default: 'Order Your Custom Art'
  },
  stats: [{
    label: { type: String, required: true },
    value: { type: String, required: true },
    description: { type: String, default: '' }
  }],
  faq: [{
    question: { type: String, required: true },
    answer: { type: String, required: true },
    order: { type: Number, default: 0 }
  }],
  pricingGuide: [{
    category: { type: String, required: true },
    medium: { type: String, default: '' },
    size: { type: String, required: true },
    startingPrice: { type: Number, required: true },
    description: { type: String, default: '' }
  }],
  socialLinks: {
    instagram: { type: String, default: 'https://instagram.com' },
    facebook: { type: String, default: 'https://facebook.com' },
    youtube: { type: String, default: 'https://youtube.com' },
    twitter: { type: String, default: 'https://twitter.com' }
  },
  seoTitle: {
    type: String,
    default: "Chulbul's Art | Custom Art Commission & Showcase"
  },
  seoDescription: {
    type: String,
    default: "Discover unique custom art commissions at Chulbul's Art. Handcrafted portraits, sketches, and paintings made with passion and soul."
  },
  footerTagline: {
    type: String,
    default: 'Crafting memories onto canvas with devotion and gentle brushstrokes.'
  },
  termsContent: {
    type: String,
    default: `### Terms of Service\n\n1. **Custom Orders**: Every artwork is handcrafted to order based on your approved specifications and references.\n2. **Quotations**: The artist reviews reference materials and provides a quote with price and estimated time.\n3. **Cancellation**: Orders may be cancelled before work enters 'In Progress' status.\n4. **Copyright**: The artist retains copyright for portfolio showcase unless an exclusivity agreement is arranged.`
  },
  privacyContent: {
    type: String,
    default: `### Privacy Policy\n\n1. **Your Photos**: Reference photographs provided for custom commissions are kept strictly confidential and used solely for the creation of your artwork.\n2. **Personal Data**: We only collect name, email, and shipping address required to fulfill your custom art order.\n3. **No Third-Party Sharing**: We never sell or share your personal data with third parties.`
  },
  refundContent: {
    type: String,
    default: `### Refund & Cancellation Policy\n\n1. **Cancellation Window**: You can cancel an order free of charge while in 'Pending Review' or 'Quoted' status.\n2. **Custom Work**: Once a commission enters 'In Progress' status, artistic time and materials are committed; cancellations after this stage are handled on a case-by-case basis.\n3. **Damaged in Transit**: If an artwork arrives damaged, please send photos within 48 hours for immediate resolution.`
  }
}, {
  timestamps: true
});

const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);
export default SiteSettings;
