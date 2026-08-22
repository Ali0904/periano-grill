import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";
import { connectDB } from "./db.js";
import { menuItems } from "./data/menuItems.js";

dotenv.config();

// Keep the dips + add-ons the storefront relies on (Home "Dips That Hit",
// Cart cross-sell, ProductDetail add-ons). Images are local & distinct.
const EXTRA = [
  { name: "Piri Piri Mayo Dip", description: "Creamy piri piri mayo dip.", price: 1.0, category: "dips", spiceLevel: 1, dietary: ["vegetarian"], image: "/images/dips/piri-mayo-dip.jpg" },
  { name: "Periano Grill Hot Sauce Bottle 250ml", description: "Take the heat home — hot sauce.", price: 4.0, category: "dips", spiceLevel: 5, dietary: ["vegetarian", "vegan", "gluten-free"], image: "/images/dips/hot-sauce-bottle.jpg" },
  { name: "Periano Grill Mango Lime Sauce Bottle 250ml", description: "Sweet & tangy mango lime sauce.", price: 4.0, category: "dips", spiceLevel: 1, dietary: ["vegetarian", "vegan", "gluten-free"], image: "/images/dips/mango-lime-sauce.jpg" },
  { name: "Extra Piri Piri Dip", description: "Add an extra pot of piri piri mayo.", price: 0.5, category: "addon", spiceLevel: 1, dietary: ["vegetarian"], image: "/images/dips/extra-piri-dip.jpg" },
  { name: "Make it Large", description: "Upgrade to large fries & a regular drink.", price: 2.5, category: "addon", spiceLevel: 0, dietary: ["halal"], image: "/images/addon/make-it-large.jpg" },
  { name: "Add Extra Chicken", description: "Add a grilled chicken portion.", price: 3.0, category: "addon", spiceLevel: 2, dietary: ["halal", "gluten-free"], image: "/images/addon/extra-chicken.jpg" }
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
