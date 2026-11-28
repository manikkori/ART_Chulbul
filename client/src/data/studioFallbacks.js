/**
 * Curated offline-resilient studio showcase data used when backend API is unreachable
 * or while previewing standalone frontend builds. All image URLs verified for zero ORB blocks.
 */

export const STUDIO_ARTWORKS = [
  {
    _id: 'pick-1',
    slug: 'serene-charcoal-heirloom-portrait',
    title: 'Serene Charcoal Portrait',
    description:
      'Hand-shaded archival charcoal heirloom portrait capturing soulful light and expression on textured 300 GSM cotton paper.',
    category: { _id: 'cat-charcoal', name: 'Charcoal Sketch', slug: 'charcoal-sketch' },
    medium: 'Charcoal on Paper',
    dimensions: '12 x 16 in',
    completionTimeDays: '7–10',
    startingPrice: 3499,
    price: 3499,
    images: [
      { url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80' },
      { url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80' },
    ],
  },
  {
    _id: 'pick-2',
    slug: 'blooming-botanical-watercolor',
    title: 'Botanical Watercolor',
    description:
      'Translucent cold-pressed watercolor blooms with soft wet-on-wet atmospheric depth and fine calligraphy accents.',
    category: { _id: 'cat-watercolor', name: 'Watercolor', slug: 'watercolor' },
    medium: 'Cold-Pressed Watercolor',
    dimensions: '11 x 14 in',
    completionTimeDays: '5–8',
    startingPrice: 2999,
    price: 2999,
    images: [
      { url: 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=800&q=80' },
      { url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80' },
    ],
  },
  {
    _id: 'pick-3',
    slug: 'timeless-floral-oil-canvas',
    title: 'Timeless Floral Oil',
    description:
      'Richly layered Dutch-inspired floral still life crafted with archival oil pigments on museum-primed Belgian canvas.',
    category: { _id: 'cat-oil', name: 'Oil Painting', slug: 'oil-painting' },
    medium: 'Oil on Canvas',
    dimensions: '16 x 20 in',
    completionTimeDays: '12–16',
    startingPrice: 7499,
    price: 7499,
    images: [
      { url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80' },
      { url: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=800&q=80' },
    ],
  },
  {
    _id: 'pick-4',
    slug: 'vibrant-palette-knife-acrylic',
    title: 'Palette Knife Abstract',
    description:
      'Sculptural heavy-body acrylic brushwork radiating dynamic motion, textured ridges, and jewel-toned luminosity.',
    category: { _id: 'cat-acrylic', name: 'Acrylic Painting', slug: 'acrylic-painting' },
    medium: 'Heavy Body Acrylic',
    dimensions: '18 x 24 in',
    completionTimeDays: '10–14',
    startingPrice: 6499,
    price: 6499,
    images: [
      { url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80' },
      { url: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=800&q=80' },
    ],
  },
  {
    _id: 'pick-5',
    slug: 'vintage-couple-portrait-oil',
    title: 'Couple Portrait in Oil',
    description:
      'Classical anniversary heirloom commissioned from cherished vintage family photographs onto stretched gallery canvas.',
    category: { _id: 'cat-oil', name: 'Oil Painting', slug: 'oil-painting' },
    medium: 'Oil on Belgian Canvas',
    dimensions: '20 x 24 in',
    completionTimeDays: '14–18',
    startingPrice: 8999,
    price: 8999,
    images: [
      { url: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=800&q=80' },
      { url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80' },
    ],
  },
  {
    _id: 'pick-6',
    slug: 'studio-brushwork-commission',
    title: 'Studio Palette Study',
    description:
      'Expressive fine-art composition combining warm crimson tones and delicate hand-drawn portrait detail.',
    category: { _id: 'cat-charcoal', name: 'Charcoal Sketch', slug: 'charcoal-sketch' },
    medium: 'Mixed Media & Carbon',
    dimensions: '10 x 14 in',
    completionTimeDays: '6–9',
    startingPrice: 2999,
    price: 2999,
    images: [
      { url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80' },
      { url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80' },
    ],
  },
  {
    _id: 'pick-7',
    slug: 'golden-hour-pet-watercolor',
    title: 'Pet Portrait Study',
    description:
      'Warm gouache and watercolor keepsake celebrating the playful charm of your beloved furry companion.',
    category: { _id: 'cat-watercolor', name: 'Watercolor', slug: 'watercolor' },
    medium: 'Watercolor & Gouache',
    dimensions: '12 x 12 in',
    completionTimeDays: '6–8',
    startingPrice: 3999,
    price: 3999,
    images: [
      { url: 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=800&q=80' },
    ],
  },
  {
    _id: 'pick-8',
    slug: 'pastel-garden-impression',
    title: 'Garden Impression',
    description:
      'Joyful impasto palette study bursting with tactile strokes ready to anchor bright modern living spaces.',
    category: { _id: 'cat-acrylic', name: 'Acrylic Painting', slug: 'acrylic-painting' },
    medium: 'Textured Acrylic',
    dimensions: '16 x 20 in',
    completionTimeDays: '8–12',
    startingPrice: 5499,
    price: 5499,
    images: [
      { url: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=800&q=80' },
    ],
  },
];

export const STUDIO_CATEGORIES = [
  {
    _id: 'cat-charcoal',
    name: 'Charcoal Portraits',
    slug: 'charcoal-sketch',
    description: 'Expressive high-contrast graphite and compressed charcoal portraits crafted stroke by stroke.',
    startingPrice: 1999,
    deliveryDays: '5–8 business days',
    image: {
      url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
    },
  },
  {
    _id: 'cat-watercolor',
    name: 'Watercolor Art',
    slug: 'watercolor',
    description: 'Delicate luminous washes on 300 GSM archival cold-pressed cotton paper.',
    startingPrice: 2499,
    deliveryDays: '6–9 business days',
    image: {
      url: 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=800&q=80',
    },
  },
  {
    _id: 'cat-oil',
    name: 'Oil on Canvas',
    slug: 'oil-painting',
    description: 'Heirloom-grade oil paintings layered onto stretched linen and primed canvas.',
    startingPrice: 5999,
    deliveryDays: '12–16 business days',
    image: {
      url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
    },
  },
  {
    _id: 'cat-acrylic',
    name: 'Acrylic Paintings',
    slug: 'acrylic-painting',
    description: 'Vibrant textured palette-knife & heavy-body acrylic artworks built for bold walls.',
    startingPrice: 4499,
    deliveryDays: '8–12 business days',
    image: {
      url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80',
    },
  },
];
