import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} environment variable is required to seed users`);
  }
  return value;
}

async function main() {
  const adminEmail = requiredEnv("SEED_ADMIN_EMAIL");
  const adminPassword = requiredEnv("SEED_ADMIN_PASSWORD");
  const customerEmail = requiredEnv("SEED_CUSTOMER_EMAIL");
  const customerPassword = requiredEnv("SEED_CUSTOMER_PASSWORD");

  console.log("Seeding Basket of Happiness database...");

  // 1. Clean existing records in reverse dependency order
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.personalisationOption.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.userAddress.deleteMany();
  await prisma.user.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.banner.deleteMany();

  // 2. Users
  const adminPasswordHash = await bcrypt.hash(adminPassword, 10);
  const adminUser = await prisma.user.create({
    data: {
      name: "BOH Master Curator",
      email: adminEmail,
      passwordHash: adminPasswordHash,
      phone: "+91 98765 43210",
      role: "ADMIN",
    },
  });

  const customerPasswordHash = await bcrypt.hash(customerPassword, 10);
  const demoCustomer = await prisma.user.create({
    data: {
      name: "Aanya Sharma",
      email: customerEmail,
      passwordHash: customerPasswordHash,
      phone: "+91 91234 56789",
      role: "CUSTOMER",
      addresses: {
        create: [
          {
            fullName: "Aanya Sharma",
            house: "Villa 42, Magnolia Greens",
            street: "Koramangala 4th Block",
            city: "Bengaluru",
            state: "Karnataka",
            pinCode: "560034",
            phone: "+91 91234 56789",
            isDefault: true,
            instructions: "Ring doorbell and leave with reception if unavailable.",
          },
        ],
      },
    },
  });

  console.log("Created users: Admin & Demo Customer");

  // 3. Categories
  const categoriesData = [
    {
      name: "Birthday",
      slug: "birthday",
      description: "Celebrate milestones with thoughtfully assembled joy boxes, cakes, and sparkling treats.",
      image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80",
      displayOrder: 1,
    },
    {
      name: "Anniversary",
      slug: "anniversary",
      description: "Timeless romantic hampers with scented candles, gourmet chocolates, and personalized notes.",
      image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80",
      displayOrder: 2,
    },
    {
      name: "Thank You",
      slug: "thank-you",
      description: "Warm gestures of heartfelt gratitude wrapped in artisanal ribbons and soothing teas.",
      image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80",
      displayOrder: 3,
    },
    {
      name: "Baby Gifts",
      slug: "baby-gifts",
      description: "Organic cotton keepsakes, plush companions, and delicate welcome gifts for little angels.",
      image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80",
      displayOrder: 4,
    },
    {
      name: "Just Because",
      slug: "just-because",
      description: "Spontaneous surprises to brighten someone's ordinary day with extraordinary happiness.",
      image: "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=800&q=80",
      displayOrder: 5,
    },
    {
      name: "For Him",
      slug: "for-him",
      description: "Refined grooming trunks, leather essentials, artisanal coffees, and sophisticated treats.",
      image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
      displayOrder: 6,
    },
    {
      name: "For Her",
      slug: "for-her",
      description: "Self-care elixirs, botanical skincare, floral arrangements, and delicate keepsake accessories.",
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
      displayOrder: 7,
    },
    {
      name: "Festive Gifts",
      slug: "festive-gifts",
      description: "Golden brass diyas, dry fruit jars, premium sweets, and radiant celebratory collections.",
      image: "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=800&q=80",
      displayOrder: 8,
    },
  ];

  const categoryMap = new Map();
  for (const cat of categoriesData) {
    const created = await prisma.category.create({ data: cat });
    categoryMap.set(cat.slug, created.id);
  }
  console.log("Created 8 categories");

  // 4. Products with Images & Personalisation Options
  const productsData = [
    {
      name: "Classic Happiness Hamper",
      slug: "classic-happiness-hamper",
      description:
        "Our signature signature boutique gift basket designed to create an instant smile. Includes Belgian artisanal chocolates, hand-poured vanilla bean soy candle, mini plush teddy, customized calligraphy greeting card, and dried lavender sprigs, presented in an eco-luxury reusable pine-wood trunk with satin ribbons.",
      specifications:
        "• 1x Artisanal Belgian Dark Chocolate Bar (80g)\n• 1x Soy Wax Vanilla Bean Scented Candle (120g, 28 hr burn time)\n• 1x Soft Velvet Mini Teddy Bear (15cm)\n• 1x Dried French Botanical Posy\n• 1x Custom Hand-Lettered Calligraphy Card\n• Handcrafted Pine Wood Trunk with Brass Clasp",
      price: 1499,
      originalPrice: 1899,
      discountPercent: 21,
      stock: 45,
      isAvailable: true,
      isFeatured: true,
      occasion: "Birthday",
      giftType: "Hamper",
      rating: 4.9,
      reviewCount: 38,
      tags: "signature, best seller, chocolate, candle, teddy, luxury",
      categorySlug: "birthday",
      images: [
        {
          url: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1000&q=80",
          alt: "Classic Happiness Hamper Gift Box",
          isPrimary: true,
          displayOrder: 0,
        },
        {
          url: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=1000&q=80",
          alt: "Classic Happiness Hamper Detail View",
          isPrimary: false,
          displayOrder: 1,
        },
        {
          url: "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=1000&q=80",
          alt: "Classic Happiness Hamper Scented Candle and Ribbon",
          isPrimary: false,
          displayOrder: 2,
        },
      ],
      personalisation: {
        title: "Personalise Your Classic Hamper",
        allowRecipientName: true,
        allowCustomMessage: true,
        allowGiftCard: true,
        allowPhotoUpload: true,
        allowGiftWrap: true,
        giftWrapPrice: 99,
        availableColors: JSON.stringify(["Warm Champagne", "Forest Velvet", "Muted Rose", "Midnight Black"]),
        additionalPrice: 0,
      },
    },
    {
      name: "Midnight Bloom Luxury Box",
      slug: "midnight-bloom-box",
      description:
        "An exquisite evening collection in a deep charcoal & rose gold magnetic rigid box. Features dried preserved burgundy roses, organic rosehip facial mist, salted caramel truffles, and an engraved gold-toned metal bookmark with custom initials.",
      specifications:
        "• 4x Preserved Real Ecuadorian Roses (lasts up to 1 year)\n• 1x Gourmet Salted Caramel Cocoa Truffles Box\n• 1x Pure Rose Water Botanical Face Mist (100ml)\n• 1x Custom Monogram Brass Bookmark\n• Deluxe Charcoal Magnetic Box with Rose Gold Foil",
      price: 1299,
      originalPrice: 1599,
      discountPercent: 18,
      stock: 28,
      isAvailable: true,
      isFeatured: true,
      occasion: "Anniversary",
      giftType: "Box",
      rating: 4.8,
      reviewCount: 24,
      tags: "romantic, preserved roses, anniversary, luxury, truffles",
      categorySlug: "anniversary",
      images: [
        {
          url: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1000&q=80",
          alt: "Midnight Bloom Box",
          isPrimary: true,
          displayOrder: 0,
        },
        {
          url: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=1000&q=80",
          alt: "Roses and Gift Box Details",
          isPrimary: false,
          displayOrder: 1,
        },
      ],
      personalisation: {
        title: "Romantic Monogram & Note",
        allowRecipientName: true,
        allowCustomMessage: true,
        allowGiftCard: true,
        allowPhotoUpload: true,
        allowGiftWrap: true,
        giftWrapPrice: 120,
        availableColors: JSON.stringify(["Charcoal Matte", "Emerald Velvet", "Rose Gold Shimmer"]),
        additionalPrice: 0,
      },
    },
    {
      name: "Sweet Moments Gourmet Hamper",
      slug: "sweet-moments-hamper",
      description:
        "A lavish culinary feast for sweet lovers. Includes hand-roasted honey almond brittle, artisan strawberry marshmallow treats, hazelnut chocolate spread jar, organic herbal hibiscus tea, and a custom engraved wooden spoon.",
      specifications:
        "• 1x Honey Almond Crunchy Brittle (150g)\n• 1x Artisanal Strawberry Marshmallows (6 pcs)\n• 1x Rich Dark Hazelnut Spread (200g)\n• 1x Whole Leaf Hibiscus Herbal Tea (50g tin)\n• 1x Laser-Engraved Beechwood Tasting Spoon\n• Handwoven Natural Cane Basket",
      price: 1699,
      originalPrice: 2099,
      discountPercent: 19,
      stock: 35,
      isAvailable: true,
      isFeatured: true,
      occasion: "Thank You",
      giftType: "Hamper",
      rating: 4.9,
      reviewCount: 42,
      tags: "gourmet, sweet, artisanal, tea, treats, honey",
      categorySlug: "thank-you",
      images: [
        {
          url: "https://images.unsplash.com/photo-1577998474517-7eeeed4e448a?auto=format&fit=crop&w=1000&q=80",
          alt: "Sweet Moments Gourmet Hamper",
          isPrimary: true,
          displayOrder: 0,
        },
        {
          url: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=1000&q=80",
          alt: "Gourmet Chocolates and Spreads",
          isPrimary: false,
          displayOrder: 1,
        },
      ],
      personalisation: {
        title: "Add Recipient & Thank You Card",
        allowRecipientName: true,
        allowCustomMessage: true,
        allowGiftCard: true,
        allowPhotoUpload: false,
        allowGiftWrap: true,
        giftWrapPrice: 80,
        availableColors: JSON.stringify(["Champagne Silk", "Soft Cream", "Sage Green"]),
        additionalPrice: 0,
      },
    },
    {
      name: "Cozy Vibes Wellness Hamper",
      slug: "cozy-vibes-hamper",
      description:
        "The ultimate comfort package for cozy evenings. Features a super-soft cloud-knit waffle throw, a stoneware ceramic mug, organic lavender chamomile bedtime brew, and a cinnamon cedarwood crackling wooden-wick candle.",
      specifications:
        "• 1x Cloud-Knit Cozy Throw Blanket (120x150cm)\n• 1x Hand-Thrown Ceramic Latte Mug in Sand\n• 1x Wooden Wick Cinnamon Cedar Soy Candle\n• 1x Organic Bedtime Chamomile Tea\n• Warm Kraft Gift Box with Botanical Wax Seal",
      price: 1399,
      originalPrice: 1699,
      discountPercent: 17,
      stock: 22,
      isAvailable: true,
      isFeatured: true,
      occasion: "Just Because",
      giftType: "Hamper",
      rating: 4.8,
      reviewCount: 19,
      tags: "cozy, wellness, self care, candle, ceramic mug, blanket",
      categorySlug: "just-because",
      images: [
        {
          url: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80",
          alt: "Cozy Vibes Hamper",
          isPrimary: true,
          displayOrder: 0,
        },
        {
          url: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=1000&q=80",
          alt: "Ceramic Mug and Cozy Moments",
          isPrimary: false,
          displayOrder: 1,
        },
      ],
      personalisation: {
        title: "Personalise Mug or Card",
        allowRecipientName: true,
        allowCustomMessage: true,
        allowGiftCard: true,
        allowPhotoUpload: true,
        allowGiftWrap: true,
        giftWrapPrice: 99,
        availableColors: JSON.stringify(["Warm Taupe", "Soft Cream", "Earthy Terracotta"]),
        additionalPrice: 0,
      },
    },
    {
      name: "Premium Velvet Emerald Hamper",
      slug: "premium-velvet-emerald-hamper",
      description:
        "An ultra-premium statement gift for prestigious milestones. Housed inside a handcrafted velvet-lined keepsake trunk with gold accents. Includes gold leaf coated almonds, premium non-alcoholic sparkling grape cider, scented diffuser, and brass photo easel.",
      specifications:
        "• 1x Royal Emerald Velvet Trunk with Hand-Stitched Lining\n• 1x Sparkling White Grape Celebration Elixir (750ml)\n• 1x Saffron Gold Glazed California Almonds (200g)\n• 1x Reed Diffuser in Oud & White Jasmine (100ml)\n• 1x Antique Brass Photo Easel with Printed Photograph\n• Hand-written Golden Ink Wax-Sealed Certificate",
      price: 2199,
      originalPrice: 2799,
      discountPercent: 21,
      stock: 15,
      isAvailable: true,
      isFeatured: true,
      occasion: "Anniversary",
      giftType: "Box",
      rating: 5.0,
      reviewCount: 47,
      tags: "luxury, velvet, emerald, sparkling, brass, premium",
      categorySlug: "anniversary",
      images: [
        {
          url: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=1000&q=80",
          alt: "Premium Velvet Emerald Hamper",
          isPrimary: true,
          displayOrder: 0,
        },
        {
          url: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1000&q=80",
          alt: "Velvet Box Interior and Goodies",
          isPrimary: false,
          displayOrder: 1,
        },
      ],
      personalisation: {
        title: "Gold Monogram & Custom Photo",
        allowRecipientName: true,
        allowCustomMessage: true,
        allowGiftCard: true,
        allowPhotoUpload: true,
        allowGiftWrap: true,
        giftWrapPrice: 150,
        availableColors: JSON.stringify(["Forest Emerald", "Midnight Charcoal", "Royal Burgundy"]),
        additionalPrice: 0,
      },
    },
    {
      name: "Personalised Keepsake Memory Frame",
      slug: "personalised-keepsake-frame",
      description:
        "Turn treasured memories into an everlasting keepsake. Features a museum-grade archival matte wooden frame with your chosen photograph printed in high definition, accompanied by a mini succulent in a ceramic planter and greeting scroll.",
      specifications:
        "• 1x Natural Oakwood Photo Frame (6x8 inches) with Glass Front\n• 1x High-Resolution Archival Photo Print Included\n• 1x Live Mini Haworthia Succulent in Ceramic Pot\n• 1x Handwritten Message Rolled in Parchment Scroll with Jute Tie\n• Eco-Friendly Gift Box with Custom Name Tag",
      price: 999,
      originalPrice: 1299,
      discountPercent: 23,
      stock: 50,
      isAvailable: true,
      isFeatured: true,
      occasion: "Birthday",
      giftType: "Keepsake",
      rating: 4.9,
      reviewCount: 64,
      tags: "photo frame, memories, keepsake, custom picture, personalised",
      categorySlug: "birthday",
      images: [
        {
          url: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=80",
          alt: "Personalised Photo Frame Keepsake",
          isPrimary: true,
          displayOrder: 0,
        },
        {
          url: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1000&q=80",
          alt: "Detail of custom frame and botanical elements",
          isPrimary: false,
          displayOrder: 1,
        },
      ],
      personalisation: {
        title: "Upload Photo & Frame Caption",
        allowRecipientName: true,
        allowCustomMessage: true,
        allowGiftCard: true,
        allowPhotoUpload: true,
        allowGiftWrap: true,
        giftWrapPrice: 90,
        availableColors: JSON.stringify(["Natural Oak", "Dark Walnut", "Crisp White"]),
        additionalPrice: 0,
      },
    },
    {
      name: "The Executive Gentleman Trunk",
      slug: "executive-gentleman-trunk",
      description:
        "Curated specifically for him. Packed with premium handcrafted vegan leather passport wallet and key fob, cold-brew coffee concentrate, smoked sea-salt almonds, and cedarwood sandalwood aftershave balm.",
      specifications:
        "• 1x Tan Vegan Leather Travel Wallet (Custom Monogrammed)\n• 1x Leather Key Organiser Fob\n• 1x Artisanal Cold Brew Bottle (250ml)\n• 1x Roasted Hickory Smoked Almonds (120g)\n• 1x Natural Sandalwood Beard & Face Balm (50g)\n• Rigid Matte Black Presentation Trunk",
      price: 2899,
      originalPrice: 3499,
      discountPercent: 17,
      stock: 18,
      isAvailable: true,
      isFeatured: false,
      occasion: "For Him",
      giftType: "Hamper",
      rating: 5.0,
      reviewCount: 22,
      tags: "for him, gentleman, leather, coffee, grooming, luxury",
      categorySlug: "for-him",
      images: [
        {
          url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80",
          alt: "The Executive Gentleman Trunk",
          isPrimary: true,
          displayOrder: 0,
        },
        {
          url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=80",
          alt: "Leather and Grooming Accessories",
          isPrimary: false,
          displayOrder: 1,
        },
      ],
      personalisation: {
        title: "Custom Monogram Initials",
        allowRecipientName: true,
        allowCustomMessage: true,
        allowGiftCard: true,
        allowPhotoUpload: false,
        allowGiftWrap: true,
        giftWrapPrice: 110,
        availableColors: JSON.stringify(["Deep Tan", "Matte Charcoal", "Rich Saddle Brown"]),
        additionalPrice: 0,
      },
    },
    {
      name: "Blushing Elegance Spa Hamper",
      slug: "blushing-elegance-hamper",
      description:
        "A soothing self-care retreat for her. Features pure mulberry silk eye sleep mask, rose quartz facial roller, whipped shea butter bath scrub, organic raspberry herbal tea, and a ceramic trinket dish.",
      specifications:
        "• 1x 100% Pure Mulberry Silk Sleep Mask in Champagne Rose\n• 1x Natural Rose Quartz Facial Roller\n• 1x Whipped Himalayan Salt & Rose Bath Scrub (200g)\n• 1x Hand-painted Ceramic Ring / Trinket Dish\n• 1x Wild Raspberry Herbal Infusion\n• Muted Rose Textured Keepsake Box with Ribbon",
      price: 1799,
      originalPrice: 2199,
      discountPercent: 18,
      stock: 25,
      isAvailable: true,
      isFeatured: false,
      occasion: "For Her",
      giftType: "Hamper",
      rating: 4.9,
      reviewCount: 31,
      tags: "for her, spa, rose quartz, silk, self-care, wellness",
      categorySlug: "for-her",
      images: [
        {
          url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=80",
          alt: "Blushing Elegance Spa Hamper",
          isPrimary: true,
          displayOrder: 0,
        },
        {
          url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80",
          alt: "Spa products and silk eye mask",
          isPrimary: false,
          displayOrder: 1,
        },
      ],
      personalisation: {
        title: "Embroidered Monogram & Message",
        allowRecipientName: true,
        allowCustomMessage: true,
        allowGiftCard: true,
        allowPhotoUpload: true,
        allowGiftWrap: true,
        giftWrapPrice: 99,
        availableColors: JSON.stringify(["Muted Rose", "Warm Champagne", "Soft Lavender"]),
        additionalPrice: 0,
      },
    },
    {
      name: "Little Joy Baby Welcome Basket",
      slug: "little-joy-baby-basket",
      description:
        "A tender and safe welcome to the newest bundle of joy. Made with certified GOTS organic cotton swaddle wrap, hypoallergenic crochet bunny rattle, milestone cards, and cold-pressed baby massage oil.",
      specifications:
        "• 1x 100% GOTS Organic Cotton Muslin Swaddle Blanket (120x120cm)\n• 1x Hand-Crocheted Bunny Teether / Rattle (BPA-free wood)\n• 1x Wooden Engraved 'Hello World' Milestone Plaque\n• 1x Organic Almond Baby Oil (100ml)\n• Natural Cotton Rope Storage Nursery Basket",
      price: 2299,
      originalPrice: 2899,
      discountPercent: 20,
      stock: 19,
      isAvailable: true,
      isFeatured: false,
      occasion: "Baby Gifts",
      giftType: "Hamper",
      rating: 4.9,
      reviewCount: 16,
      tags: "baby, organic, welcome baby, newborn, cotton, rattle",
      categorySlug: "baby-gifts",
      images: [
        {
          url: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1000&q=80",
          alt: "Little Joy Baby Basket",
          isPrimary: true,
          displayOrder: 0,
        },
        {
          url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80",
          alt: "Organic Cotton and Baby Keepsakes",
          isPrimary: false,
          displayOrder: 1,
        },
      ],
      personalisation: {
        title: "Baby Name & Date of Birth",
        allowRecipientName: true,
        allowCustomMessage: true,
        allowGiftCard: true,
        allowPhotoUpload: true,
        allowGiftWrap: true,
        giftWrapPrice: 100,
        availableColors: JSON.stringify(["Sage Neutral", "Buttercream", "Soft Peach", "Sky Blue"]),
        additionalPrice: 0,
      },
    },
    {
      name: "Golden Glow Festive Celebration Box",
      slug: "golden-glow-festive-box",
      description:
        "Radiant festive opulence. Featuring two handcrafted brass lotus urli diyas, roasted saffron pistachios and cashews, artisanal silver foil kaju katli, and natural soy wax incense cones.",
      specifications:
        "• 2x Handcrafted Brass Lotus Diyas with Carved Detailing\n• 1x Roasted Saffron Spiced Pistachios (150g jar)\n• 1x Glazed Jumbo Cashews (150g jar)\n• 1x Pure Silver Leaf Sweet Confections Box (8 pcs)\n• 1x Organic Sandalwood Dhoop Cones in Brass Holder\n• Royal Gold-Embossed Rigid Keepsake Box",
      price: 2499,
      originalPrice: 3199,
      discountPercent: 22,
      stock: 30,
      isAvailable: true,
      isFeatured: false,
      occasion: "Festive Gifts",
      giftType: "Box",
      rating: 4.9,
      reviewCount: 29,
      tags: "festive, diwali, celebration, brass diya, dry fruits, sweets",
      categorySlug: "festive-gifts",
      images: [
        {
          url: "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=1000&q=80",
          alt: "Golden Glow Festive Box",
          isPrimary: true,
          displayOrder: 0,
        },
        {
          url: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1000&q=80",
          alt: "Festive Brass Diya and Dry Fruits",
          isPrimary: false,
          displayOrder: 1,
        },
      ],
      personalisation: {
        title: "Festive Family Wishes & Tag",
        allowRecipientName: true,
        allowCustomMessage: true,
        allowGiftCard: true,
        allowPhotoUpload: false,
        allowGiftWrap: true,
        giftWrapPrice: 120,
        availableColors: JSON.stringify(["Royal Crimson", "Emerald Gold", "Festive Ochre"]),
        additionalPrice: 0,
      },
    },
    {
      name: "Artisanal Aromatherapy Serenity Box",
      slug: "aromatherapy-serenity-box",
      description:
        "A mindful sanctuary of calming scents and rituals. Contains two therapeutic essential oil blends (Sleep & Uplift), a matte ceramic tea-light warmer, dried botanical smudge stick, and matches in a cork vial.",
      specifications:
        "• 1x Organic French Lavender Essential Oil (15ml)\n• 1x Bergamot Sweet Orange Blend (15ml)\n• 1x Minimalist Ceramic Oil Diffuser\n• 1x California White Sage & Lavender Smudge Wand\n• 1x Luxury Long Wooden Matchsticks in Apothecary Glass\n• Eco-friendly Earth-Toned Gift Crate",
      price: 1899,
      originalPrice: 2399,
      discountPercent: 21,
      stock: 20,
      isAvailable: true,
      isFeatured: false,
      occasion: "Thank You",
      giftType: "Box",
      rating: 4.8,
      reviewCount: 18,
      tags: "aromatherapy, essential oils, peace, relaxation, ceramic diffuser",
      categorySlug: "thank-you",
      images: [
        {
          url: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1000&q=80",
          alt: "Artisanal Aromatherapy Serenity Box",
          isPrimary: true,
          displayOrder: 0,
        },
        {
          url: "https://images.unsplash.com/photo-1506152983158-b4a74a01c721?auto=format&fit=crop&w=1000&q=80",
          alt: "Aromatherapy Oils and Botanicals",
          isPrimary: false,
          displayOrder: 1,
        },
      ],
      personalisation: {
        title: "Peaceful Wishes & Card",
        allowRecipientName: true,
        allowCustomMessage: true,
        allowGiftCard: true,
        allowPhotoUpload: false,
        allowGiftWrap: true,
        giftWrapPrice: 99,
        availableColors: JSON.stringify(["Earthy Kraft", "Forest Green", "Calm Grey"]),
        additionalPrice: 0,
      },
    },
    {
      name: "Gratitude Botanical Treat Hamper",
      slug: "gratitude-botanical-hamper",
      description:
        "A simple, warm, and heartfelt 'Thank You'. Handcrafted tea-blends paired with raw wildflower honey in a cork jar, wooden honey dipper, almond cookies, and plantable seed paper greeting card.",
      specifications:
        "• 1x Forest Wildflower Raw Honey (120g cork jar)\n• 1x Hand-carved Olive Wood Honey Dipper\n• 1x Kashmiri Saffron Kahwa Tea (50g)\n• 1x Artisanal Butter Almond Biscotti (100g)\n• 1x Wildflower Plantable Seed Paper Thank You Note\n• Recyclable Kraft Caddy with Jute Cord",
      price: 1199,
      originalPrice: 1499,
      discountPercent: 20,
      stock: 40,
      isAvailable: true,
      isFeatured: false,
      occasion: "Thank You",
      giftType: "Hamper",
      rating: 4.7,
      reviewCount: 25,
      tags: "honey, thank you, gratitude, herbal tea, biscotti, plantable card",
      categorySlug: "thank-you",
      images: [
        {
          url: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1000&q=80",
          alt: "Gratitude Botanical Hamper",
          isPrimary: true,
          displayOrder: 0,
        },
        {
          url: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=1000&q=80",
          alt: "Honey and Tea Gift Set",
          isPrimary: false,
          displayOrder: 1,
        },
      ],
      personalisation: {
        title: "Gratitude Note & Recipient Name",
        allowRecipientName: true,
        allowCustomMessage: true,
        allowGiftCard: true,
        allowPhotoUpload: true,
        allowGiftWrap: true,
        giftWrapPrice: 85,
        availableColors: JSON.stringify(["Natural Kraft", "Sage Botanical", "Champagne White"]),
        additionalPrice: 0,
      },
    },
  ];

  const productRecords = [];
  for (const item of productsData) {
    const { categorySlug, images, personalisation, ...productFields } = item;
    const categoryId = categoryMap.get(categorySlug);

    const product = await prisma.product.create({
      data: {
        ...productFields,
        categoryId,
        images: {
          create: images,
        },
        personalisationOptions: {
          create: [personalisation],
        },
      },
    });
    productRecords.push(product);
  }
  console.log(`Created ${productRecords.length} curated products with imagery and personalisation options`);

  // 5. Customer Reviews
  const reviewsData = [
    {
      productIndex: 0, // Classic Happiness
      authorName: "Pooja Varma",
      rating: 5,
      comment:
        "Ordered this for my sister's birthday and she literally cried happy tears! The handwritten card and the fragrance of the candle when opening the box was just breathtaking. 10/10 luxury experience!",
      isVerifiedPurchase: true,
      isApproved: true,
    },
    {
      productIndex: 0,
      authorName: "Rahul Kulkarni",
      rating: 5,
      comment:
        "The pine wood trunk is so well built that my wife still keeps her jewellery in it. Fast on-time delivery in Bengaluru with crisp packaging.",
      isVerifiedPurchase: true,
      isApproved: true,
    },
    {
      productIndex: 1, // Midnight Bloom
      authorName: "Ananya Deshmukh",
      rating: 5,
      comment:
        "The preserved roses look as fresh today as they did on our anniversary day 3 months ago. Highly recommended for special occasions.",
      isVerifiedPurchase: true,
      isApproved: true,
    },
    {
      productIndex: 4, // Velvet Emerald
      authorName: "Vikram Malhotra",
      rating: 5,
      comment:
        "Undoubtedly the most opulent gift hamper in India. The velvet finish and brass photo frame made our wedding anniversary unforgettable.",
      isVerifiedPurchase: true,
      isApproved: true,
    },
    {
      productIndex: 5, // Keepsake Frame
      authorName: "Meera Nair",
      rating: 5,
      comment:
        "The photo print quality was museum grade, and the succulent arrived in pristine condition. Basket of Happiness really lives up to its name!",
      isVerifiedPurchase: true,
      isApproved: true,
    },
    {
      productIndex: 2, // Sweet Moments
      authorName: "Siddharth Sen",
      rating: 5,
      comment:
        "Sent this as a corporate thank you to my business mentor. He loved the hazelnut spread and praised the tasteful packaging.",
      isVerifiedPurchase: true,
      isApproved: true,
    },
  ];

  for (const rev of reviewsData) {
    const targetProduct = productRecords[rev.productIndex];
    if (targetProduct) {
      await prisma.review.create({
        data: {
          productId: targetProduct.id,
          authorName: rev.authorName,
          rating: rev.rating,
          comment: rev.comment,
          isVerifiedPurchase: rev.isVerifiedPurchase,
          isApproved: rev.isApproved,
        },
      });
    }
  }
  console.log("Created customer reviews");

  // 6. Active Discount Coupons
  const couponsData = [
    {
      code: "HAPPINESS10",
      discountType: "PERCENTAGE",
      discountValue: 10,
      minOrderValue: 999,
      maxDiscount: 500,
      isActive: true,
      usageCount: 42,
    },
    {
      code: "WELCOME50",
      discountType: "FIXED",
      discountValue: 150,
      minOrderValue: 1299,
      maxDiscount: 150,
      isActive: true,
      usageCount: 78,
    },
    {
      code: "FESTIVE20",
      discountType: "PERCENTAGE",
      discountValue: 20,
      minOrderValue: 2199,
      maxDiscount: 800,
      isActive: true,
      usageCount: 19,
    },
  ];

  for (const c of couponsData) {
    await prisma.coupon.create({ data: c });
  }
  console.log("Created discount coupons");

  // 7. Seed sample orders for demo customer and admin analytics
  const sampleOrder1 = await prisma.order.create({
    data: {
      orderNumber: "BOH-2026-8941",
      userId: demoCustomer.id,
      customerName: "Aanya Sharma",
      customerEmail,
      customerPhone: "+91 91234 56789",
      house: "Villa 42, Magnolia Greens",
      street: "Koramangala 4th Block",
      city: "Bengaluru",
      state: "Karnataka",
      pinCode: "560034",
      deliveryInstructions: "Call before delivering",
      deliveryMethod: "EXPRESS",
      estimatedDelivery: "28 Oct 2026",
      giftMessage: "To my dearest friend, wishing you endless smiles and sweetness! With all my love, Aanya.",
      giftWrap: true,
      giftWrapTheme: "Warm Champagne",
      subtotal: 1499,
      discount: 150,
      couponCode: "WELCOME50",
      shippingFee: 0,
      totalAmount: 1349,
      paymentMethod: "RAZORPAY",
      paymentStatus: "PAID",
      paymentTransactionId: "pay_rzp_live_test_782194",
      fulfilmentStatus: "SHIPPED",
      trackingNumber: "BOH-DTDC-9928174",
      trackingCarrier: "DTDC Express Air",
      notes: "Express priority delivery requested for birthday morning",
      items: {
        create: [
          {
            productId: productRecords[0].id,
            productName: productRecords[0].name,
            productImage: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=500&q=80",
            unitPrice: 1499,
            quantity: 1,
            totalPrice: 1499,
            recipientName: "Rhea Kapoor",
            customMessage: "Happy 25th Birthday Rhea!",
            giftCardMessage: "May your year be as radiant as your heart.",
            chosenColor: "Warm Champagne",
          },
        ],
      },
    },
  });

  const sampleOrder2 = await prisma.order.create({
    data: {
      orderNumber: "BOH-2026-6412",
      userId: demoCustomer.id,
      customerName: "Aanya Sharma",
      customerEmail,
      customerPhone: "+91 91234 56789",
      house: "Villa 42, Magnolia Greens",
      street: "Koramangala 4th Block",
      city: "Bengaluru",
      state: "Karnataka",
      pinCode: "560034",
      deliveryMethod: "STANDARD",
      estimatedDelivery: "15 Oct 2026",
      giftMessage: "Happy Anniversary Mom & Dad!",
      giftWrap: true,
      giftWrapTheme: "Forest Emerald",
      subtotal: 2199,
      discount: 220,
      couponCode: "HAPPINESS10",
      shippingFee: 0,
      totalAmount: 1979,
      paymentMethod: "UPI",
      paymentStatus: "PAID",
      paymentTransactionId: "upi_boh_99812401",
      fulfilmentStatus: "DELIVERED",
      trackingNumber: "BOH-BLUEDART-881234",
      trackingCarrier: "Blue Dart Apex",
      items: {
        create: [
          {
            productId: productRecords[4].id,
            productName: productRecords[4].name,
            productImage: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=500&q=80",
            unitPrice: 2199,
            quantity: 1,
            totalPrice: 2199,
            recipientName: "Mr. & Mrs. Sharma",
            customMessage: "30 Years of Pure Love",
            chosenColor: "Forest Emerald",
          },
        ],
      },
    },
  });

  // Wishlist item for demo customer
  await prisma.wishlistItem.create({
    data: {
      userId: demoCustomer.id,
      productId: productRecords[1].id,
    },
  });

  // 8. Homepage Promotional Banners
  await prisma.banner.createMany({
    data: [
      {
        title: "More Than Just Gifts, It's a Feeling.",
        subtitle: "Thoughtfully curated hampers, gifts and personalised surprises for every special moment in life.",
        link: "/shop",
        ctaText: "Shop Now",
        imageUrl: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=80",
        type: "HERO",
        isActive: true,
        displayOrder: 1,
      },
      {
        title: "Festive Joy & Celebration Hampers",
        subtitle: "Order ahead for milestone celebrations with complimentary handcrafted calligraphy cards.",
        link: "/shop?occasion=festive-gifts",
        ctaText: "Explore Collection",
        imageUrl: "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=1200&q=80",
        type: "SEASONAL",
        isActive: true,
        displayOrder: 2,
      },
    ],
  });

  console.log("Seeding complete! Admin & Demo Customer ready.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
