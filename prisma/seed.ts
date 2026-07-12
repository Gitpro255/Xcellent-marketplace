import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const sellers = [
    { email: "timber@example.com", name: "Chidi Okoro", shop: "Old Timber Co.", city: "Enugu" },
    { email: "wick@example.com", name: "Ngozi Eze", shop: "Marrow & Wick", city: "Ibadan" },
    { email: "audio@example.com", name: "Tunde Bello", shop: "Northlane Audio", city: "Lagos" },
    { email: "botanicals@example.com", name: "Grace Danjuma", shop: "Bramblewood Botanicals", city: "Jos" },
    { email: "outfitters@example.com", name: "Musa Ibrahim", shop: "Fieldstone Outfitters", city: "Kaduna" },
    { email: "leather@example.com", name: "Femi Adeyemi", shop: "Lagos Leather Co.", city: "Lagos" },
    { email: "kitchen@example.com", name: "Ngozi Uche", shop: "Mama Ngozi's Kitchen", city: "Port Harcourt" },
    { email: "techhub@example.com", name: "Emeka Obi", shop: "TechHub Lagos", city: "Lagos" },
    { email: "vogue@example.com", name: "Amara Nwosu", shop: "Vogue Threads", city: "Abuja" },
    { email: "solemate@example.com", name: "Ifeanyi Nnamdi", shop: "SoleMate Footwear", city: "Aba" },
  ];

  const password = await bcrypt.hash("password123", 10);
  const shopIds: Record<string, string> = {};

  for (const s of sellers) {
    const user = await prisma.user.upsert({
      where: { email: s.email },
      update: {},
      create: {
        name: s.name,
        email: s.email,
        phone: "0800 000 0000",
        password,
        role: "SELLER",
        emailVerified: new Date(),
        shop: { create: { name: s.shop, city: s.city } },
      },
      include: { shop: true },
    });
    shopIds[s.shop] = user.shop!.id;
  }

  // Demo buyer account: demo@example.com / password123
  await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: {},
    create: {
      name: "Demo Buyer",
      email: "demo@example.com",
      phone: "0800 111 2222",
      password,
      role: "BUYER",
      emailVerified: new Date(),
    },
  });

  const products = [
    { title: "Hand-turned oak bowl", price: 3500000, category: "Home & Craft", shop: "Old Timber Co.", stock: 14, emoji: "🥣", color: "#8B5E34", image: "https://images.unsplash.com/photo-1634612831148-03a8550e1d52?auto=format&fit=crop&w=800&q=80", description: "Each bowl is turned from a single piece of reclaimed oak and finished with food-safe walnut oil." },
    { title: "Linen napkin set of 6", price: 1800000, category: "Home & Craft", shop: "Old Timber Co.", stock: 30, emoji: "🧺", color: "#C9B896", image: "https://images.unsplash.com/photo-1679312124272-48f6a8f4f3f6?auto=format&fit=crop&w=800&q=80", description: "Stonewashed European linen in a warm oat colour, softens with every wash." },
    { title: "Soy candle, cedar & fig", price: 1200000, category: "Home & Craft", shop: "Marrow & Wick", stock: 40, emoji: "🕯️", color: "#5A3E2B", image: "https://images.unsplash.com/photo-1663089889826-0575c6ae19de?auto=format&fit=crop&w=800&q=80", description: "Poured in small batches with a cotton wick and a 45-hour burn time." },
    { title: "Northlane open-back headphones", price: 14500000, category: "Electronics", shop: "Northlane Audio", stock: 6, emoji: "🎧", color: "#26343A", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80", description: "Planar magnetic drivers with a walnut earcup housing, 3-year warranty." },
    { title: "Wireless earbuds, ANC", price: 4200000, category: "Electronics", shop: "Northlane Audio", stock: 25, emoji: "🎶", color: "#2E2A2E", image: "https://images.unsplash.com/photo-1722448113450-f6860b7fbfe5?auto=format&fit=crop&w=800&q=80", description: "Active noise cancelling earbuds with a 28-hour case battery." },
    { title: "Calendula healing salve", price: 650000, category: "Wellness", shop: "Bramblewood Botanicals", stock: 55, emoji: "🌼", color: "#7A8B4A", image: "https://images.unsplash.com/photo-1567722071783-1f7df9d5a31e?auto=format&fit=crop&w=800&q=80", description: "A gentle balm for dry skin, made with calendula grown on the seller's own plot." },
    { title: "Rosemary mint shampoo bar", price: 450000, category: "Wellness", shop: "Bramblewood Botanicals", stock: 70, emoji: "🧼", color: "#6B7A5A", image: "https://images.unsplash.com/photo-1650189608237-db034f45e552?auto=format&fit=crop&w=800&q=80", description: "A zero-waste shampoo bar for normal to oily hair." },
    { title: "Waxed canvas field jacket", price: 9500000, category: "Apparel", shop: "Fieldstone Outfitters", stock: 9, emoji: "🧥", color: "#3E4A3D", image: "https://images.unsplash.com/photo-1467069323122-8cfd5b311841?auto=format&fit=crop&w=800&q=80", description: "12oz waxed canvas shell with a wool blend lining." },
    { title: "Camp percolator, 9-cup", price: 2800000, category: "Outdoors", shop: "Fieldstone Outfitters", stock: 21, emoji: "☕", color: "#4A4238", image: "https://images.unsplash.com/photo-1521871460521-c7780a35e114?auto=format&fit=crop&w=800&q=80", description: "Stainless steel percolator that works on a camp stove or open flame." },
    { title: "Leather crossbody bag", price: 3200000, category: "Accessories", shop: "Lagos Leather Co.", stock: 18, emoji: "👜", color: "#5A3A28", image: "https://images.unsplash.com/photo-1517612228538-cefdbc2c01e7?auto=format&fit=crop&w=800&q=80", description: "Full-grain leather, hand-stitched in Lagos, ages beautifully over time." },
    { title: "Beaded bracelet set", price: 850000, category: "Accessories", shop: "Lagos Leather Co.", stock: 60, emoji: "📿", color: "#8B5A3C", image: "https://images.unsplash.com/photo-1602527428055-a2526fabdc9f?auto=format&fit=crop&w=800&q=80", description: "A stack of five handmade beaded bracelets in warm earth tones." },
    { title: "Jollof rice spice mix", price: 320000, category: "Food", shop: "Mama Ngozi's Kitchen", stock: 100, emoji: "🍚", color: "#B4472E", image: "https://images.unsplash.com/photo-1603496987674-79600a000f55?auto=format&fit=crop&w=800&q=80", description: "Mama Ngozi's signature blend — just add rice, tomato and pepper." },
    { title: "Dried plantain chips", price: 250000, category: "Food", shop: "Mama Ngozi's Kitchen", stock: 120, emoji: "🍌", color: "#C99A2E", image: "https://images.unsplash.com/photo-1762884601729-0eeeafbdfb8a?auto=format&fit=crop&w=800&q=80", description: "Lightly salted plantain chips, fried in small batches." },
    { title: "Zobo hibiscus drink mix", price: 280000, category: "Food", shop: "Mama Ngozi's Kitchen", stock: 80, emoji: "🧉", color: "#7A2035", image: "https://images.unsplash.com/photo-1602856124289-0331a6eff6fe?auto=format&fit=crop&w=800&q=80", description: "A tangy hibiscus concentrate with ginger and pineapple notes." },
    { title: "iPhone 11, 128GB", price: 28000000, category: "Phones", shop: "TechHub Lagos", stock: 12, emoji: "📱", color: "#1C1C1E", image: "https://images.unsplash.com/photo-1663373460363-448cf1bf9402?auto=format&fit=crop&w=800&q=80", description: "Refurbished, fully tested, battery health 85%+. Unlocked, comes with charging cable." },
    { title: "iPhone 12, 128GB", price: 35000000, category: "Phones", shop: "TechHub Lagos", stock: 10, emoji: "📱", color: "#2C2C2E", image: "https://images.unsplash.com/photo-1663373460363-448cf1bf9402?auto=format&fit=crop&w=800&q=80", description: "Refurbished, fully tested, battery health 88%+. Unlocked, comes with charging cable." },
    { title: "iPhone 13, 128GB", price: 42000000, category: "Phones", shop: "TechHub Lagos", stock: 9, emoji: "📱", color: "#3A3A3C", image: "https://images.unsplash.com/photo-1663373460363-448cf1bf9402?auto=format&fit=crop&w=800&q=80", description: "Refurbished, fully tested, battery health 90%+. Unlocked, comes with charging cable." },
    { title: "iPhone 14, 128GB", price: 52000000, category: "Phones", shop: "TechHub Lagos", stock: 7, emoji: "📱", color: "#48484A", image: "https://images.unsplash.com/photo-1663373460363-448cf1bf9402?auto=format&fit=crop&w=800&q=80", description: "Refurbished, fully tested, battery health 92%+. Unlocked, comes with charging cable." },
    { title: "Wireless earpods", price: 2200000, category: "Electronics", shop: "TechHub Lagos", stock: 45, emoji: "🎧", color: "#E8E4DC", image: "https://images.unsplash.com/photo-1722448113450-f6860b7fbfe5?auto=format&fit=crop&w=800&q=80", description: "Compact true-wireless earbuds with charging case. Touch controls, 20-hour total battery." },
    { title: "Ladies' wide-leg trousers", price: 1200000, category: "Apparel", shop: "Vogue Threads", stock: 30, emoji: "👖", color: "#4A5568", image: "https://images.unsplash.com/photo-1666792494266-16d83aaf1105?auto=format&fit=crop&w=800&q=80", description: "High-waisted wide-leg trousers in stretch fabric. Runs true to size." },
    { title: "Crop top", price: 750000, category: "Apparel", shop: "Vogue Threads", stock: 40, emoji: "👚", color: "#C05B7A", image: "https://images.unsplash.com/photo-1770918655041-5de83c95ccf9?auto=format&fit=crop&w=800&q=80", description: "Ribbed crop top with a fitted stretch. Pairs well with high-waisted bottoms." },
    { title: "Classic T-shirt", price: 600000, category: "Apparel", shop: "Vogue Threads", stock: 80, emoji: "👕", color: "#3C4A5C", image: "https://images.unsplash.com/photo-1620799139507-2a76f79a2f4d?auto=format&fit=crop&w=800&q=80", description: "100% cotton unisex tee, pre-shrunk. Available in multiple colours." },
    { title: "Short trousers (shorts)", price: 800000, category: "Apparel", shop: "Vogue Threads", stock: 50, emoji: "🩳", color: "#5A6B4A", image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=800&q=80", description: "Casual cotton-blend shorts with side pockets and a drawstring waist." },
    { title: "Ladies' evening gown", price: 3200000, category: "Apparel", shop: "Vogue Threads", stock: 12, emoji: "👗", color: "#6B2C4A", description: "Fitted evening gown with a flowing skirt. Made to order in your size." },
    { title: "Men's kaftan", price: 1800000, category: "Apparel", shop: "Vogue Threads", stock: 20, emoji: "🥻", color: "#2E3B4A", description: "Simple, breathable men's kaftan in cotton blend. Casual or occasion wear." },
    { title: "High heel sandals", price: 1900000, category: "Footwear", shop: "SoleMate Footwear", stock: 22, emoji: "👠", color: "#7A2020", image: "https://images.unsplash.com/photo-1686668572495-2832c97ea508?auto=format&fit=crop&w=800&q=80", description: "Block-heel sandals with an ankle strap. Comfortable enough for all-day wear." },
    { title: "Ladies' slides (palms)", price: 550000, category: "Footwear", shop: "SoleMate Footwear", stock: 60, emoji: "🩴", color: "#B4472E", description: "Soft, simple slide sandals for everyday wear. Lightweight and quick-drying." },
    { title: "Men's loafers", price: 2100000, category: "Footwear", shop: "SoleMate Footwear", stock: 18, emoji: "👞", color: "#3E2A1E", description: "Genuine leather loafers with a cushioned insole. Slip-on, goes with everything." },
    { title: "Men's leather belt", price: 650000, category: "Accessories", shop: "SoleMate Footwear", stock: 55, emoji: "👔", color: "#2E2118", description: "Full-grain leather belt with a classic buckle. Available in black or brown." },
  ];

  for (const p of products) {
    const { shop, ...data } = p;
    await prisma.product.create({ data: { ...data, shopId: shopIds[shop] } });
  }

  console.log("Seeded", sellers.length, "sellers and", products.length, "products.");
  console.log("Demo buyer login: demo@example.com / password123");
  console.log("Demo seller login (e.g.): timber@example.com / password123");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
