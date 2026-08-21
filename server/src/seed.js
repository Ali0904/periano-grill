import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";
import { connectDB } from "./db.js";
import { menuItems } from "./data/menuItems.js";

dotenv.config();

const IMG = {
  sauce: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&q=80",
  fries: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&q=80",
  grilled: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&q=80"
};

// Keep the dips + add-ons the storefront relies on (Home "Dips That Hit",
// Cart cross-sell, ProductDetail add-ons).
const EXTRA = [
  { name: "Piri Piri Mayo Dip", description: "Creamy piri piri mayo dip.", price: 1.0, category: "dips", spiceLevel: 1, dietary: ["vegetarian"], image: IMG.sauce },
  { name: "Periano Grill Hot Sauce Bottle 250ml", description: "Take the heat home — hot sauce.", price: 4.0, category: "dips", spiceLevel: 5, dietary: ["vegetarian", "vegan", "gluten-free"], image: IMG.sauce },
  { name: "Periano Grill Mango Lime Sauce Bottle 250ml", description: "Sweet & tangy mango lime sauce.", price: 4.0, category: "dips", spiceLevel: 1, dietary: ["vegetarian", "vegan", "gluten-free"], image: IMG.sauce },
  { name: "Extra Piri Piri Dip", description: "Add an extra pot of piri piri mayo.", price: 0.5, category: "addon", spiceLevel: 1, dietary: ["vegetarian"], image: IMG.sauce },
  { name: "Make it Large", description: "Upgrade to large fries & a regular drink.", price: 2.5, category: "addon", spiceLevel: 0, dietary: ["halal"], image: IMG.fries },
  { name: "Add Extra Chicken", description: "Add a grilled chicken portion.", price: 3.0, category: "addon", spiceLevel: 2, dietary: ["halal", "gluten-free"], image: IMG.grilled }
];

const ALL = [...menuItems, ...EXTRA];

// Enrich with ratings / reviews / tags so the assistant can surface
// top sellers, best-rated and customer-favourite items.
const SEED_PRODUCTS = ALL.map((p, i) => {
  const rating = +(4.2 + ((i * 7) % 8) * 0.1).toFixed(1);
  const reviews = 42 + i * 13;
  const tags = [];
  if (p.featured) tags.push("customer-favourite");
  if (p.category === "grill-specialties" || p.category === "burgers") tags.push("top-seller");
  return { ...p, rating, reviews, tags };
});

async function seed() {
  await connectDB();
  await Product.deleteMany({});
  await Product.insertMany(SEED_PRODUCTS);
  console.log(`Seeded ${SEED_PRODUCTS.length} products into "${mongoose.connection.name}".`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
