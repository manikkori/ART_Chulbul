import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB, { closeDB } from '../config/db.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Artwork from '../models/Artwork.js';
import SiteSettings from '../models/SiteSettings.js';
import ArtistProfile from '../models/ArtistProfile.js';
import Review from '../models/Review.js';
import CustomOrder from '../models/CustomOrder.js';
import Message from '../models/Message.js';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();
    console.log('[Seed] Connected to database. Starting fresh seed...');

    // Clear existing data
    await User.deleteMany();
    await Category.deleteMany();
    await Artwork.deleteMany();
    await SiteSettings.deleteMany();
    await ArtistProfile.deleteMany();
    await Review.deleteMany();
    await CustomOrder.deleteMany();
    await Message.deleteMany();

    // 1. Seed Admin User
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@artchulbul.com').toLowerCase();
    const adminUser = await User.create({
      name: process.env.ADMIN_NAME || 'Chulbul Admin',
      email: adminEmail,
      password: process.env.ADMIN_PASSWORD || 'Admin@123456',
      role: 'admin',
      avatar: {
        url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        publicId: 'seed_admin_avatar'
      }
    });
    console.log(`[Seed] Admin created: ${adminUser.email}`);

    // Seed a sample customer user for testing
    const sampleCustomer = await User.create({
      name: 'Aarav Sharma',
      email: 'customer@example.com',
      password: 'Customer@123456',
      role: 'customer',
      avatar: {
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        publicId: 'seed_customer_avatar'
      },
      addresses: [{
        recipientName: 'Aarav Sharma',
        phone: '+91 98765 43210',
        street: 'Flat 402, Lotus Residency, MG Road',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560001',
        country: 'India',
        isDefault: true
      }]
    });
    console.log(`[Seed] Sample Customer created: ${sampleCustomer.email}`);

    // 2. Seed 5 Categories
    const categoriesData = [
      {
        name: 'Charcoal / Pencil Sketch Portraits',
        slug: 'charcoal-pencil-sketch-portraits',
        description: 'Deep contrast, fine expressive strokes, and timeless monochrome elegance captured in pure graphite and willow charcoal.',
        image: {
          url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
          publicId: 'cat_charcoal'
        },
        startingPrice: 1999,
        displayOrder: 1,
        isActive: true
      },
      {
        name: 'Water Color Art',
        slug: 'water-color-art',
        description: 'Luminous washes, organic blooming colors, and delicate transparency on heavyweight cold-pressed cotton paper.',
        image: {
          url: 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=800&q=80',
          publicId: 'cat_watercolor'
        },
        startingPrice: 2499,
        displayOrder: 2,
        isActive: true
      },
      {
        name: 'Oil Painting',
        slug: 'oil-painting',
        description: 'Rich buttery textures, classical blending, archival permanence, and unmatched visual depth on stretched linen canvas.',
        image: {
          url: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80',
          publicId: 'cat_oil'
        },
        startingPrice: 4999,
        displayOrder: 3,
        isActive: true
      },
      {
        name: 'Acrylic Painting',
        slug: 'acrylic-painting',
        description: 'Vivid hues, dynamic impasto layers, and modern brilliance that brings your favorite spaces to life.',
        image: {
          url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80',
          publicId: 'cat_acrylic'
        },
        startingPrice: 3499,
        displayOrder: 4,
        isActive: true
      },
      {
        name: 'Pencil Color Art',
        slug: 'pencil-color-art',
        description: 'Intricate multi-layered color pencil realism with razor-sharp detailing and soft, velvety transitions.',
        image: {
          url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80',
          publicId: 'cat_pencil_color'
        },
        startingPrice: 2299,
        displayOrder: 5,
        isActive: true
      }
    ];

    const seededCategories = await Category.insertMany(categoriesData);
    console.log(`[Seed] Seeded ${seededCategories.length} categories.`);

    const catMap = {};
    seededCategories.forEach(cat => {
      catMap[cat.slug] = cat._id;
    });

    // 3. Seed Artworks for Showcase
    const artworksData = [
      {
        title: 'Serene Grandfather & Child Portrait',
        slug: 'serene-grandfather-child-portrait',
        description: 'A deeply personal commission rendered from a 40-year-old vintage photograph. Every wrinkle and tender expression was preserved with delicate blending.',
        category: catMap['charcoal-pencil-sketch-portraits'],
        medium: 'Graphite & Willow Charcoal on Fabriano 300gsm',
        dimensions: 'A3 (11.7 x 16.5 inches)',
        timeTaken: '22 hours across 5 days',
        startingPrice: 2999,
        coverImage: {
          url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=900&q=80',
          publicId: 'art_1_cover'
        },
        images: [
          { url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=900&q=80', isCover: true, caption: 'Final completed commission' },
          { url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=900&q=80', isCover: false, caption: 'Detailing work in progress' }
        ],
        tags: ['Portrait', 'Charcoal', 'Generational', 'Realistic'],
        isFeatured: true,
        isPublished: true
      },
      {
        title: 'Golden Hour Mountain Lake Symphony',
        slug: 'golden-hour-mountain-lake-symphony',
        description: 'Custom landscape commission depicting the sunset reflecting off Dal Lake in Srinagar, painted using transparent glazes of artist-grade watercolor.',
        category: catMap['water-color-art'],
        medium: 'Artist-Grade Watercolor on Arches 100% Cotton 300gsm',
        dimensions: 'A2 (16.5 x 23.4 inches)',
        timeTaken: '16 hours across 3 days',
        startingPrice: 4499,
        coverImage: {
          url: 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=900&q=80',
          publicId: 'art_2_cover'
        },
        images: [
          { url: 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=900&q=80', isCover: true, caption: 'Finished painting in daylight' }
        ],
        tags: ['Landscape', 'Watercolor', 'Sunset', 'Nature'],
        isFeatured: true,
        isPublished: true
      },
      {
        title: 'Heirloom Heritage Floral Still Life',
        slug: 'heirloom-heritage-floral-still-life',
        description: 'Classical European still-life inspired oil on canvas commission with impasto flower petals and glowing dramatic chiaroscuro illumination.',
        category: catMap['oil-painting'],
        medium: 'Winsor & Newton Artist Oils on Primed Linen Canvas',
        dimensions: '18 x 24 inches',
        timeTaken: '36 hours across 2 weeks',
        startingPrice: 7999,
        coverImage: {
          url: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=900&q=80',
          publicId: 'art_3_cover'
        },
        images: [
          { url: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=900&q=80', isCover: true, caption: 'Stretched canvas view' }
        ],
        tags: ['Oil', 'Canvas', 'Floral', 'Classical'],
        isFeatured: true,
        isPublished: true
      },
      {
        title: 'Modern Abstract Whispers in Cobalt',
        slug: 'modern-abstract-whispers-in-cobalt',
        description: 'Dynamic textured palette knife commission tailored to complement modern minimalist living room aesthetics with metallic gold leaf highlights.',
        category: catMap['acrylic-painting'],
        medium: 'Heavy Body Acrylics & 24K Gold Leaf on Gallery Canvas',
        dimensions: '24 x 36 inches',
        timeTaken: '20 hours across 4 days',
        startingPrice: 5999,
        coverImage: {
          url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=900&q=80',
          publicId: 'art_4_cover'
        },
        images: [
          { url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=900&q=80', isCover: true, caption: 'Framed gallery piece' }
        ],
        tags: ['Abstract', 'Acrylic', 'Contemporary', 'Textured'],
        isFeatured: true,
        isPublished: true
      },
      {
        title: 'Vibrant Kingfisher Wildlife Study',
        slug: 'vibrant-kingfisher-wildlife-study',
        description: 'Hyper-detailed wildlife commission capturing individual feather iridescence using over 40 distinct Faber-Castell Polychromos pencil shades.',
        category: catMap['pencil-color-art'],
        medium: 'Faber-Castell Polychromos on Strathmore Bristol Smooth',
        dimensions: 'A4 (8.3 x 11.7 inches)',
        timeTaken: '19 hours across 3 days',
        startingPrice: 3299,
        coverImage: {
          url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=900&q=80',
          publicId: 'art_5_cover'
        },
        images: [
          { url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=900&q=80', isCover: true, caption: 'Macro feather view' }
        ],
        tags: ['Wildlife', 'Color Pencil', 'Realism', 'Birds'],
        isFeatured: true,
        isPublished: true
      },
      {
        title: 'Timeless Monochromatic Bridal Portrait',
        slug: 'timeless-monochromatic-bridal-portrait',
        description: 'An emotional wedding day commission highlighting intricate bridal veil lace and quiet bridal grace in pure charcoal tonal gradation.',
        category: catMap['charcoal-pencil-sketch-portraits'],
        medium: 'Nitram Charcoal on Strathmore 400 Series Heavyweight',
        dimensions: 'A3 (11.7 x 16.5 inches)',
        timeTaken: '26 hours across 6 days',
        startingPrice: 3499,
        coverImage: {
          url: 'https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?auto=format&fit=crop&w=900&q=80',
          publicId: 'art_6_cover'
        },
        images: [
          { url: 'https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?auto=format&fit=crop&w=900&q=80', isCover: true, caption: 'Completed bridal piece' }
        ],
        tags: ['Wedding', 'Bridal', 'Charcoal', 'Portrait'],
        isFeatured: false,
        isPublished: true
      }
    ];

    const seededArtworks = await Artwork.insertMany(artworksData);
    console.log(`[Seed] Seeded ${seededArtworks.length} artworks.`);

    // 4. Seed SiteSettings
    await SiteSettings.create({
      siteName: "Chulbul's Art",
      heroTitle: 'Handmade, Personalized Art Made Exclusively For You',
      heroSubtitle: 'Every brushstroke tells your story. Send us your reference photo, receive a custom quote, and watch your memories turn into timeless original art.',
      heroImage: {
        url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
        publicId: 'hero_default'
      },
      heroCtaText: 'Order Your Custom Art',
      stats: [
        { label: 'Custom Artworks Delivered', value: '450+', description: 'Across all Indian states & union territories' },
        { label: 'Client Satisfaction', value: '99%', description: 'Based on verified customer reviews' },
        { label: 'Years of Artistic Passion', value: '8+', description: 'Specialized in hand-drawn portraits' }
      ],
      faq: [
        {
          question: 'How do custom art commissions work?',
          answer: 'You choose your preferred medium and size, upload your reference photo, and describe any special requests. The artist reviews your photo, prepares a tailored quote and delivery estimate. Once you accept, painting begins with regular progress photo updates until safely delivered to your doorstep.',
          order: 1
        },
        {
          question: 'What kind of reference photos should I upload?',
          answer: 'Clear, well-lit, high-resolution photos work best. Avoid heavily filtered or blurry images. If you have multiple pictures or want two people from separate photos combined into one portrait, you can upload up to 5 photos and explain your idea in the notes.',
          order: 2
        },
        {
          question: 'How long does a custom painting take?',
          answer: 'Pencil sketches and watercolors typically take 4 to 8 working days. Detailed oil paintings on canvas take 2 to 3 weeks due to oil layer drying and curing times. You will always see an estimated completion time with your quote.',
          order: 3
        },
        {
          question: 'How is the artwork packaged and shipped?',
          answer: 'Every piece is treated with an archival protective fixative/varnish, acid-free interleaving paper, bubble cushioning, and encased in rigid corner guards or high-strength postal tubes for maximum protection during domestic courier transit.',
          order: 4
        },
        {
          question: 'Can I request revisions during the painting process?',
          answer: 'Yes! The artist shares work-in-progress photos in your per-order chat thread. You can give feedback and small adjustments before the final protective fixative is applied and the piece is shipped.',
          order: 5
        }
      ],
      pricingGuide: [
        { category: 'Charcoal / Pencil Sketch Portraits', medium: 'Charcoal / Graphite', size: 'A4 (8.3 x 11.7 in)', startingPrice: 1999, description: 'Single subject face portrait with soft vignette background.' },
        { category: 'Charcoal / Pencil Sketch Portraits', medium: 'Charcoal / Graphite', size: 'A3 (11.7 x 16.5 in)', startingPrice: 2999, description: 'Single or couple portrait with detailed apparel and shading.' },
        { category: 'Water Color Art', medium: 'Artist Watercolor', size: 'A3 (11.7 x 16.5 in)', startingPrice: 3499, description: 'Expressive color harmony on 300gsm cold-pressed cotton paper.' },
        { category: 'Oil Painting', medium: 'Artist Oil on Canvas', size: '16 x 20 inches', startingPrice: 5999, description: 'Archival museum-grade stretched canvas, rich impasto depth.' },
        { category: 'Acrylic Painting', medium: 'Heavy Body Acrylic', size: '18 x 24 inches', startingPrice: 4499, description: 'Vibrant modern palette, satin varnish finish.' },
        { category: 'Pencil Color Art', medium: 'Polychromos Pencils', size: 'A4 (8.3 x 11.7 in)', startingPrice: 2499, description: 'Hyper-detailed colored pencil study with velvety blends.' }
      ],
      socialLinks: {
        instagram: 'https://instagram.com/chulbulsart',
        facebook: 'https://facebook.com/chulbulsart',
        youtube: 'https://youtube.com/@chulbulsart',
        twitter: 'https://twitter.com/chulbulsart'
      },
      seoTitle: "Chulbul's Art | Custom Art Commission & Showcase",
      seoDescription: "Transform your treasured photos into handcrafted original art. Bespoke pencil portraits, watercolors, oils, and sketches by Chulbul's Art.",
      footerTagline: 'Crafting memories onto canvas with devotion and gentle brushstrokes.'
    });
    console.log('[Seed] SiteSettings seeded with siteName: "Chulbul\'s Art"');

    // 5. Seed ArtistProfile
    await ArtistProfile.create({
      artistName: 'Chulbul',
      shortBio: 'Fine artist dedicated to preserving emotional human moments through hyper-realistic pencil sketch portraits, luminous watercolors, and timeless oil paintings.',
      story: 'What started as quiet afternoons sketching family photographs has grown into an enduring artistic calling. Over the past 8 years, I have poured countless hours into refining traditional techniques—mastering the delicate feathering of charcoal, the spontaneous fluidity of watercolor, and the deep, sculptural resonance of oil paints. Every commissioned piece is treated not simply as an order, but as an heirloom crafted with respect, heart, and patience.',
      philosophy: 'A custom commission is a sacred collaboration. When you entrust me with a photograph of your grandparents, your child, your beloved pet, or a milestone day, my goal is not just photorealism—it is to capture the unspoken spirit and warmth that makes that memory irreplaceable.',
      skillsMediums: [
        { name: 'Graphite & Charcoal Realism', experienceLevel: 'Master', description: 'Expert in micro-tonal gradation, skin textures, hair strands, and deep velvet shadows.' },
        { name: 'Cold-Pressed Watercolor', experienceLevel: 'Advanced', description: 'Wet-on-wet atmospheric washes and crisp botanical/landscape glazes.' },
        { name: 'Traditional Oil Painting', experienceLevel: 'Advanced', description: 'Classical layering, grisaille underpainting, and rich impasto textures.' },
        { name: 'Polychromos Color Pencil', experienceLevel: 'Master', description: 'Wax and oil-based color pencil realism with seamless color transitions.' }
      ],
      experienceTimeline: [
        { year: '2018', title: 'The First Easel', description: 'Started taking private portrait commissions for friends and local art collectors.' },
        { year: '2020', title: 'Studio Expansion', description: 'Dedicated full-time studio space to large-scale canvas oil paintings and bridal portraits.' },
        { year: '2022', title: 'State Art Showcase', description: 'Selected for the Regional Fine Arts exhibition with award-winning charcoal studies.' },
        { year: '2024 - Present', title: "Chulbul's Art Digital Commission Studio", description: 'Crafting bespoke heirloom commissions for collectors and families across India.' }
      ],
      achievements: [
        { year: '2023', title: 'Best Traditional Medium Portrait Award', organization: 'All India Fine Arts Guild' },
        { year: '2022', title: 'Excellence in Watercolor Landscapes', organization: 'Kala Utsav Art Society' }
      ],
      processSteps: [
        { stepNumber: 1, title: 'Photo Consultation & Composition', description: 'Analyzing your photos for lighting, mood, and compositional balance before sketching starts.' },
        { stepNumber: 2, title: 'Archival Material Preparation', description: 'Selecting heavy 300gsm European cotton paper or hand-stretching Belgian linen canvas.' },
        { stepNumber: 3, title: 'Underdrawing & Block-In', description: 'Establishing anatomical proportions and focal points with light preliminary guidelines.' },
        { stepNumber: 4, title: 'Detailed Rendering & Progress Updates', description: 'Building up tonal layers and sharing high-definition progress snaps directly in your order chat.' },
        { stepNumber: 5, title: 'Archival Sealing & Secure Packaging', description: 'Applying museum-grade UV fixative, protective packaging, and insured courier dispatch.' }
      ],
      photo: {
        url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
        publicId: 'artist_profile_photo'
      }
    });
    console.log('[Seed] ArtistProfile seeded.');

    // 6. Seed Sample Reviews
    await Review.create([
      {
        customer: sampleCustomer._id,
        artwork: seededArtworks[0]._id,
        rating: 5,
        comment: 'I commissioned a portrait of my late grandfather for my father’s 60th birthday. When my father unwrapped it, he was moved to tears. The level of detail and soul captured in the eyes is unbelievable.',
        photo: {
          url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=500&q=80',
          publicId: 'review_photo_1'
        },
        isApproved: true,
        showOnHome: true
      },
      {
        customer: sampleCustomer._id,
        artwork: seededArtworks[1]._id,
        rating: 5,
        comment: 'The watercolor landscape turned out even more vibrant than our holiday photo. Super smooth communication throughout the process and safe packaging. Thank you Chulbul!',
        photo: {
          url: 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=500&q=80',
          publicId: 'review_photo_2'
        },
        isApproved: true,
        showOnHome: true
      }
    ]);
    console.log('[Seed] Sample approved reviews seeded.');

    console.log('[Seed] All seed data populated successfully!');
    await closeDB();
    process.exit(0);
  } catch (err) {
    console.error('[Seed] Error during seeding:', err);
    await closeDB();
    process.exit(1);
  }
};

seedData();
