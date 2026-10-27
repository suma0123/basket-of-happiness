import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedHampers() {
  console.log("Seeding Hamper Boxes and Custom Hamper Categories/Products...");

  // 1. Seed Hamper Boxes
  const boxesData = [
    {
      name: "Little Joy Box",
      slug: "little-joy-box",
      description: "A charming, petite luxury box crafted for intimate tokens of affection and sweet surprises.",
      price: 199,
      dimensions: "20 × 15 × 8 cm",
      capacity: "Holds 3–5 items",
      image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=85",
      isAvailable: true,
      displayOrder: 1,
    },
    {
      name: "Classic Gift Box",
      slug: "classic-gift-box",
      description: "Our signature rigid gift box with a soft-touch matte ivory finish and concealed magnetic clasp.",
      price: 299,
      dimensions: "26 × 20 × 10 cm",
      capacity: "Holds 5–8 items",
      image: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=800&q=85",
      isAvailable: true,
      displayOrder: 2,
    },
    {
      name: "Premium Hamper Box",
      slug: "premium-hamper-box",
      description: "Deep forest green trunk with royal gold foil calligraphy embossing and textured ribbon pull.",
      price: 499,
      dimensions: "32 × 25 × 12 cm",
      capacity: "Holds 7–12 items",
      image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=85",
      isAvailable: true,
      displayOrder: 3,
    },
    {
      name: "Luxury Celebration Box",
      slug: "luxury-celebration-box",
      description: "Grand artisanal keepsake chest with brushed brass accents, rich velvet bedding, and heirloom finish.",
      price: 699,
      dimensions: "40 × 30 × 15 cm",
      capacity: "Holds 10–16 items",
      image: "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=800&q=85",
      isAvailable: true,
      displayOrder: 4,
    },
  ];

  for (const box of boxesData) {
    await prisma.hamperBox.upsert({
      where: { slug: box.slug },
      update: box,
      create: box,
    });
  }

  // 2. Ensure all 14 Categories exist
  const categoriesList = [
    {
      name: "Chocolates & Sweets",
      slug: "chocolates-sweets",
      description: "Artisanal Belgian truffles, gourmet cocoa bars, roasted nutty dragees, and traditional sweets.",
      image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=800&q=80",
      displayOrder: 1,
    },
    {
      name: "Snacks & Treats",
      slug: "snacks-treats",
      description: "Artisanal butter cookies, spiced savory nuts, gourmet trail mixes, and organic fruit crisps.",
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
      displayOrder: 2,
    },
    {
      name: "Flowers",
      slug: "flowers",
      description: "Everlasting preserved botanicals, fragrant mini rose posies, and handcrafted dried floral bundles.",
      image: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=80",
      displayOrder: 3,
    },
    {
      name: "Teddy Bears & Soft Toys",
      slug: "teddy-bears-soft-toys",
      description: "Plush, huggable organic companions and keepsake teddy bears designed to melt hearts.",
      image: "https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=800&q=80",
      displayOrder: 4,
    },
    {
      name: "Candles & Fragrances",
      slug: "candles-fragrances",
      description: "Hand-poured pure soy wax jars, wooden wick aromatherapy candles, and floral room mists.",
      image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80",
      displayOrder: 5,
    },
    {
      name: "Mugs & Drinkware",
      slug: "mugs-drinkware",
      description: "Hand-glazed ceramic mugs, insulated thermal tumblers, and elegant gold-rimmed glassware.",
      image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
      displayOrder: 6,
    },
    {
      name: "Skincare & Self-Care",
      slug: "skincare-self-care",
      description: "Botanical body balms, soothing rosewater mists, luxury bath salts, and artisanal soaps.",
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
      displayOrder: 7,
    },
    {
      name: "Jewellery & Accessories",
      slug: "jewellery-accessories",
      description: "Delicate charm bracelets, minimalist pendant necklaces, silk scarves, and cuff accessories.",
      image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
      displayOrder: 8,
    },
    {
      name: "Personalised Gifts",
      slug: "personalised-gifts",
      description: "Bespoke engraved keepsakes, custom engraved keyrings, acrylic plaques, and name coasters.",
      image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80",
      displayOrder: 9,
    },
    {
      name: "Photo Frames",
      slug: "photo-frames",
      description: "Vintage brass glass frames, raw wood easel displays, and romantic memory photo stands.",
      image: "https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&w=800&q=80",
      displayOrder: 10,
    },
    {
      name: "Stationery",
      slug: "stationery",
      description: "Gold-embossed linen journals, luxury metal rollerball pens, wax seal sets, and memo notes.",
      image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=800&q=80",
      displayOrder: 11,
    },
    {
      name: "Cute Accessories",
      slug: "cute-accessories",
      description: "Handcrafted enamel pins, pastel hair ribbons, whimsical luggage tags, and aesthetic charms.",
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
      displayOrder: 12,
    },
    {
      name: "Premium Gifts",
      slug: "premium-gifts",
      description: "Solid brass vintage bookmarks, marble drink coaster sets, and Italian leather accessories.",
      image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
      displayOrder: 13,
    },
    {
      name: "Other Available Products",
      slug: "other-available-products",
      description: "Thoughtful gift add-ons, celebratory cake toppers, fairy lights, and keepsake decor.",
      image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80",
      displayOrder: 14,
    },
  ];

  const categoryMap = new Map<string, string>();
  for (const cat of categoriesList) {
    const saved = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    categoryMap.set(cat.slug, saved.id);
  }

  // 3. Products per category for the Hamper Builder
  const hamperProducts = [
    // Chocolates & Sweets
    {
      name: "Assorted Belgian Chocolate Box",
      slug: "assorted-belgian-chocolate-box",
      categorySlug: "chocolates-sweets",
      description: "Eight handcrafted pralines and truffles infused with hazelnut praline, salted caramel, and dark raspberry.",
      price: 249,
      originalPrice: 299,
      stock: 45,
      occasion: "All Occasions",
      giftType: "Treats",
      image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Artisanal Dark Chocolate Bar (72% Cocoa)",
      slug: "artisanal-dark-chocolate-bar",
      categorySlug: "chocolates-sweets",
      description: "Single-origin Ecuadorian cacao bar with sea salt crystals and roasted almond slivers.",
      price: 149,
      originalPrice: 199,
      stock: 60,
      occasion: "All Occasions",
      giftType: "Treats",
      image: "https://images.unsplash.com/photo-1582293041079-7814c2f12063?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "French Silk Truffle Pack (6 pcs)",
      slug: "french-silk-truffle-pack",
      categorySlug: "chocolates-sweets",
      description: "Velvety smooth cocoa-dusted ganache truffles that melt blissfully on the tongue.",
      price: 299,
      originalPrice: 349,
      stock: 35,
      occasion: "Anniversary, Birthday",
      giftType: "Treats",
      image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Gourmet Almond Biscotti Box",
      slug: "gourmet-almond-biscotti-box",
      categorySlug: "chocolates-sweets",
      description: "Crisp twice-baked Italian cookies studded with roasted Californian almonds and vanilla bean.",
      price: 199,
      originalPrice: 249,
      stock: 40,
      occasion: "Thank You, Just Because",
      giftType: "Treats",
      image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=800&q=80",
    },

    // Snacks & Treats
    {
      name: "Glazed Honey Roasted Cashews (120g)",
      slug: "glazed-honey-roasted-cashews",
      categorySlug: "snacks-treats",
      description: "Jumbo Goan cashews roasted with wild forest honey and cracked black pepper.",
      price: 249,
      originalPrice: 299,
      stock: 50,
      occasion: "All Occasions",
      giftType: "Snacks",
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Saffron Spiced Pistachios Jar",
      slug: "saffron-spiced-pistachios-jar",
      categorySlug: "snacks-treats",
      description: "Lightly salted golden pistachios dusted with Kashmiri saffron and cardamom.",
      price: 299,
      originalPrice: 349,
      stock: 30,
      occasion: "Festive, Celebration",
      giftType: "Snacks",
      image: "https://images.unsplash.com/photo-1536599018102-9f803c140fc1?auto=format&fit=crop&w=800&q=80",
    },

    // Flowers
    {
      name: "Mini Preserved Rose Posy",
      slug: "mini-preserved-rose-posy",
      categorySlug: "flowers",
      description: "Real roses preserved to maintain their lush beauty and vibrant petals for over two years.",
      price: 299,
      originalPrice: 399,
      stock: 40,
      occasion: "Anniversary, Birthday, Romance",
      giftType: "Flowers",
      image: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Earthy Dried Lavender & Bunny Tails",
      slug: "earthy-dried-lavender-bundle",
      categorySlug: "flowers",
      description: "Fragrant French lavender sprigs tied with fluffy cream lagurus grass and rustic jute ribbon.",
      price: 199,
      originalPrice: 249,
      stock: 50,
      occasion: "Thank You, Just Because",
      giftType: "Flowers",
      image: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=80",
    },

    // Soft Toys
    {
      name: "Mini Cuddle Teddy Bear (Blush Cream)",
      slug: "mini-cuddle-teddy-bear-cream",
      categorySlug: "teddy-bears-soft-toys",
      description: "Supersoft plush teddy with embroidered paws and a vintage grosgrain neck ribbon.",
      price: 199,
      originalPrice: 249,
      stock: 40,
      occasion: "Birthday, Baby Gifts, Romance",
      giftType: "Soft Toy",
      image: "https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Classic Heirloom Brown Teddy Bear",
      slug: "classic-heirloom-brown-teddy",
      categorySlug: "teddy-bears-soft-toys",
      description: "Charming traditional collector teddy bear with soft honey fur and articulated limbs.",
      price: 399,
      originalPrice: 499,
      stock: 25,
      occasion: "Birthday, Celebration",
      giftType: "Soft Toy",
      image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80",
    },

    // Candles & Fragrances
    {
      name: "Vanilla Bean & Warm Amber Soy Candle",
      slug: "vanilla-amber-soy-candle",
      categorySlug: "candles-fragrances",
      description: "Clean-burning soy wax in a matte ceramic jar infused with Madagascar vanilla and cozy golden amber.",
      price: 249,
      originalPrice: 320,
      stock: 45,
      occasion: "All Occasions",
      giftType: "Candle",
      image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "English Pear & Freesia Room Fragrance Mist",
      slug: "pear-freesia-room-mist",
      categorySlug: "candles-fragrances",
      description: "Refreshing botanical atmosphere mist crafted with delicate white freesias and ripe autumn pears.",
      price: 349,
      originalPrice: 420,
      stock: 30,
      occasion: "Self-Care, Housewarming",
      giftType: "Fragrance",
      image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80",
    },

    // Mugs & Drinkware
    {
      name: "Hand-Thrown Ceramic 'Moments of Joy' Mug",
      slug: "ceramic-moments-of-joy-mug",
      categorySlug: "mugs-drinkware",
      description: "Stoneware mug with artisanal speckled cream glaze and hand-stamped botanical emblem.",
      price: 199,
      originalPrice: 260,
      stock: 55,
      occasion: "Birthday, Thank You",
      giftType: "Drinkware",
      image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Double-Walled Gold Rim Coffee Glass",
      slug: "double-walled-gold-rim-glass",
      categorySlug: "mugs-drinkware",
      description: "Insulated borosilicate thermal glass with real 18K gold luster lining on the rim.",
      price: 349,
      originalPrice: 450,
      stock: 35,
      occasion: "Anniversary, Premium",
      giftType: "Drinkware",
      image: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80",
    },

    // Skincare & Self-Care
    {
      name: "Botanical Rose & Hibiscus Body Soufflé",
      slug: "rose-hibiscus-body-souffle",
      categorySlug: "skincare-self-care",
      description: "Whipped shea and mango butter infused with organic damask rose oil for silky softness.",
      price: 249,
      originalPrice: 320,
      stock: 40,
      occasion: "For Her, Self-Care",
      giftType: "Skincare",
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Himalayan Pink Bath Crystals with Petals",
      slug: "himalayan-pink-bath-crystals",
      categorySlug: "skincare-self-care",
      description: "Pure mineral bath salts blended with calming lavender flowers and sweet almond oil.",
      price: 199,
      originalPrice: 260,
      stock: 50,
      occasion: "Relaxation, Birthday",
      giftType: "Self-Care",
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
    },

    // Jewellery & Accessories
    {
      name: "Dainty Pearl Charm Cord Bracelet",
      slug: "dainty-pearl-charm-bracelet",
      categorySlug: "jewellery-accessories",
      description: "Freshwater cultured pearl suspended on an adjustable silk cord with 18k gold-plated accents.",
      price: 299,
      originalPrice: 399,
      stock: 30,
      occasion: "Romance, Birthday",
      giftType: "Jewellery",
      image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
    },

    // Personalised Gifts
    {
      name: "Custom Acrylic Keepsake Plaque",
      slug: "custom-acrylic-keepsake-plaque",
      categorySlug: "personalised-gifts",
      description: "High-clarity optical acrylic stand customized with your song, date, or heartfelt message.",
      price: 299,
      originalPrice: 399,
      stock: 45,
      occasion: "Anniversary, Birthday",
      giftType: "Personalised",
      image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80",
    },

    // Photo Frames
    {
      name: "Brass Floating Glass Photo Frame",
      slug: "brass-floating-glass-photo-frame",
      categorySlug: "photo-frames",
      description: "Artisanal double-glass frame with antique brass hinge closure. Ideal for polaroids or 4×6 prints.",
      price: 349,
      originalPrice: 450,
      stock: 30,
      occasion: "Keepsake, Anniversary",
      giftType: "Frame",
      image: "https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&w=800&q=80",
    },

    // Stationery
    {
      name: "Hardcover Gold-Foil Linen Journal",
      slug: "gold-foil-linen-journal",
      categorySlug: "stationery",
      description: "Clothbound luxury journal with ribbon marker and 120gsm fountain-pen friendly ivory paper.",
      price: 249,
      originalPrice: 320,
      stock: 50,
      occasion: "Inspiration, Work, Graduation",
      giftType: "Stationery",
      image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=800&q=80",
    },

    // Cute Accessories
    {
      name: "Enamel Botanical Heart Keychain",
      slug: "enamel-botanical-heart-keychain",
      categorySlug: "cute-accessories",
      description: "Gold-plated hard enamel charm featuring delicate ivy vine detailing and sturdy lobster ring.",
      price: 149,
      originalPrice: 199,
      stock: 65,
      occasion: "Just Because",
      giftType: "Accessory",
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
    },

    // Premium Gifts
    {
      name: "Hand-Carved Olive Wood Trinket Dish",
      slug: "hand-carved-olive-wood-dish",
      categorySlug: "premium-gifts",
      description: "Natural organic olive wood dish with unique marbling grains, perfect for jewelry or keepsakes.",
      price: 399,
      originalPrice: 499,
      stock: 25,
      occasion: "Luxury, Wedding",
      giftType: "Premium",
      image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
    },

    // Other Available Products
    {
      name: "Warm Fairy String Lights (Battery Operated)",
      slug: "warm-fairy-string-lights",
      categorySlug: "other-available-products",
      description: "Copper micro-LED string lights that bring an enchanting warm glow to any gift hamper presentation.",
      price: 99,
      originalPrice: 149,
      stock: 80,
      occasion: "Celebration, Festive",
      giftType: "Decor",
      image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80",
    },
  ];

  for (const prod of hamperProducts) {
    const categoryId = categoryMap.get(prod.categorySlug) || null;
    const existing = await prisma.product.findUnique({
      where: { slug: prod.slug },
    });

    if (existing) {
      await prisma.product.update({
        where: { id: existing.id },
        data: {
          name: prod.name,
          description: prod.description,
          price: prod.price,
          originalPrice: prod.originalPrice,
          stock: prod.stock,
          categoryId,
          occasion: prod.occasion,
          giftType: prod.giftType,
        },
      });
    } else {
      const created = await prisma.product.create({
        data: {
          name: prod.name,
          slug: prod.slug,
          description: prod.description,
          price: prod.price,
          originalPrice: prod.originalPrice,
          stock: prod.stock,
          isAvailable: true,
          occasion: prod.occasion,
          giftType: prod.giftType,
          categoryId,
          images: {
            create: [
              {
                url: prod.image,
                alt: prod.name,
                isPrimary: true,
                displayOrder: 0,
              },
            ],
          },
        },
      });
      console.log(`Created product: ${created.name}`);
    }
  }

  console.log("Successfully seeded Hamper Boxes and Custom Hamper Products!");
}

if (require.main === module) {
  seedHampers()
    .then(() => prisma.$disconnect())
    .catch((e) => {
      console.error(e);
      prisma.$disconnect();
      process.exit(1);
    });
}
