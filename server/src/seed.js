import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";
import { connectDB } from "./db.js";

dotenv.config();

const IMG = {
  grilled: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&q=80",
  fried: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=600&q=80",
  veg: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
  quesadilla: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&q=80",
  platter: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80",
  kids: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=600&q=80",
  fries: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&q=80",
  wings: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=600&q=80",
  meat: "https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=600&q=80",
  sauce: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&q=80",
  icecream: "https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=600&q=80",
  drink: "https://images.unsplash.com/photo-1437418747212-8d9709afab22?w=600&q=80",
  rice: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&q=80"
};

const SAMPLE_PRODUCTS = [
  // Grilled Collection Meal
  { name: "Chick 'N' Rice - Meal", description: "Grilled chicken with rice, regular fries, drink & dip.", price: 12.0, category: "grilled", spiceLevel: 2, dietary: ["halal", "gluten-free"], image: IMG.rice },
  { name: "Periano Grill 5 Tender Strips - Meal", description: "5 grilled tender strips with fries, drink & dip.", price: 11.0, category: "grilled", spiceLevel: 2, dietary: ["halal", "gluten-free"], image: IMG.grilled },
  { name: "5x Periano Grill Wings - Meal", description: "5 flame-grilled wings with fries, drink & dip.", price: 10.0, category: "grilled", spiceLevel: 3, dietary: ["halal", "gluten-free"], image: IMG.wings },
  { name: "Hot Spicy Quesadilla - Meal", description: "Spicy grilled chicken quesadilla with fries, drink & dip.", price: 10.0, category: "grilled", spiceLevel: 4, dietary: ["halal"], image: IMG.quesadilla },
  { name: "Quarter Chicken - Meal", description: "Periano Grill legendary quarter chicken with fries, drink & dip.", price: 10.0, category: "grilled", spiceLevel: 2, dietary: ["halal", "gluten-free"], image: IMG.grilled },
  { name: "Gourmet Beef - Meal", description: "Grilled gourmet beef with fries, drink & dip.", price: 12.0, category: "grilled", spiceLevel: 2, dietary: ["halal", "gluten-free"], image: IMG.meat },
  { name: "Gourmet Lamb - Meal", description: "Grilled gourmet lamb with fries, drink & dip.", price: 12.0, category: "grilled", spiceLevel: 2, dietary: ["halal", "gluten-free"], image: IMG.meat },
  { name: "Texan Beef - Meal", description: "Texan-style grilled beef with fries, drink & dip.", price: 12.0, category: "grilled", spiceLevel: 3, dietary: ["halal", "gluten-free"], image: IMG.meat },
  { name: "Texan Lamb - Meal", description: "Texan-style grilled lamb with fries, drink & dip.", price: 12.0, category: "grilled", spiceLevel: 3, dietary: ["halal", "gluten-free"], image: IMG.meat },

  // Fried Collection
  { name: "The Wrap - Meal", description: "Crispy fried chicken wrap with fries, drink & dip.", price: 11.79, category: "fried", spiceLevel: 2, dietary: ["halal"], image: IMG.fried },
  { name: "Chicken & Cheese Quesadilla - Meal", description: "Fried chicken & cheese quesadilla with fries, drink & dip.", price: 11.79, category: "fried", spiceLevel: 2, dietary: ["halal"], image: IMG.quesadilla },

  // Vegetarian Collection
  { name: "Paneer Rice - Meal", description: "Grilled paneer with rice, fries, drink & dip.", price: 13.29, category: "vegetarian", spiceLevel: 1, dietary: ["vegetarian"], image: IMG.veg },
  { name: "Veggie Wrap - Meal", description: "Grilled veggie wrap with fries, drink & dip.", price: 10.99, category: "vegetarian", spiceLevel: 1, dietary: ["vegetarian"], image: IMG.veg },

  // Platters
  { name: "Family Platter", description: "A feast for the family — chicken, wings, sides & dips.", price: 29.99, category: "platters", spiceLevel: 2, dietary: ["halal"], image: IMG.platter },
  { name: "Periano Grill Mixed Platter", description: "Mixed grilled meats with sides and dips.", price: 24.99, category: "platters", spiceLevel: 3, dietary: ["halal"], image: IMG.platter },

  // Kids
  { name: "Periano Grill Kids Meal", description: "Mini grilled chicken with fries, drink & a treat.", price: 6.99, category: "kids", spiceLevel: 1, dietary: ["halal", "gluten-free"], image: IMG.kids },

  // Sides
  { name: "Half Chicken", description: "Periano Grill legendary flame-grilled half chicken.", price: 12.79, category: "sides", spiceLevel: 2, dietary: ["halal", "gluten-free"], image: IMG.grilled },
  { name: "Large Fries", description: "Crispy seasoned fries.", price: 3.29, category: "sides", spiceLevel: 0, dietary: ["vegetarian", "vegan", "gluten-free"], image: IMG.fries },
  { name: "18x Wings", description: "18 flame-grilled piri piri wings.", price: 21.39, category: "sides", spiceLevel: 3, dietary: ["halal", "gluten-free"], image: IMG.wings },

  // Dips
  { name: "Piri Piri Mayo Dip", description: "Creamy piri piri mayo dip.", price: 1.0, category: "dips", spiceLevel: 1, dietary: ["vegetarian"], image: IMG.sauce },
  { name: "Periano Grill Hot Sauce Bottle 250ml", description: "Take the heat home — hot sauce.", price: 4.0, category: "dips", spiceLevel: 5, dietary: ["vegetarian", "vegan", "gluten-free"], image: IMG.sauce },
  { name: "Periano Grill Mango Lime Sauce Bottle 250ml", description: "Sweet & tangy mango lime sauce.", price: 4.0, category: "dips", spiceLevel: 1, dietary: ["vegetarian", "vegan", "gluten-free"], image: IMG.sauce },

  // Desserts
  { name: "Ben & Jerry's Ice Cream", description: "Chocolate fudge brownie tub.", price: 4.5, category: "desserts", spiceLevel: 0, dietary: ["vegetarian", "gluten-free"], image: IMG.icecream },

  // Drinks
  { name: "Regular Drink", description: "Choose from a range of soft drinks.", price: 1.99, category: "drinks", spiceLevel: 0, dietary: ["vegetarian", "vegan", "gluten-free"], image: IMG.drink },
  { name: "Bottled Water", description: "Still water 500ml.", price: 1.2, category: "drinks", spiceLevel: 0, dietary: ["vegetarian", "vegan", "gluten-free"], image: IMG.drink },

  // Add-ons (excluded from menu grid, used on product detail page)
  { name: "Extra Piri Piri Dip", description: "Add an extra pot of piri piri mayo.", price: 0.5, category: "addon", spiceLevel: 1, dietary: ["vegetarian"], image: IMG.sauce },
  { name: "Make it Large", description: "Upgrade to large fries & a regular drink.", price: 2.5, category: "addon", spiceLevel: 0, dietary: ["halal"], image: IMG.fries },
  { name: "Add Extra Chicken", description: "Add a grilled chicken portion.", price: 3.0, category: "addon", spiceLevel: 2, dietary: ["halal", "gluten-free"], image: IMG.grilled }
];

// Enrich with ratings / reviews / tags so the assistant can surface
// top sellers, best-rated and customer-favourite items.
const SEED_PRODUCTS = SAMPLE_PRODUCTS.map((p, i) => {
  const rating = +(4.2 + ((i * 7) % 8) * 0.1).toFixed(1); // varies 4.2–4.9
  const reviews = 42 + i * 13;
  const tags = [];
  if (p.category === "grilled" && i < 4) tags.push("top-seller", "customer-favourite");
  if (p.category === "platters") tags.push("customer-favourite");
  if (/hot sauce/i.test(p.name)) tags.push("customer-favourite");
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
