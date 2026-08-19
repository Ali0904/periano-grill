import express from "express";
import rateLimit from "express-rate-limit";
import Product from "../models/Product.js";

const router = express.Router();

const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please slow down." }
});

const SITE = {
  name: "Periano Grill",
  ordering: "Order delivery, click & collect, or dine-in from the Menu page. Build your box and check out in a few taps.",
  stores: "We have stores across the UK — use the 'Our Stores' page to find your nearest Periano Grill and get directions.",
  hours: "Most stores are open 11:00–23:00, with delivery until late. Check your local store page for exact hours.",
  contact: "Reach us via the 'Our Stores' page for your nearest branch, or through our social channels in the footer.",
  services: ["Delivery", "Click & Collect", "Dine-in", "Catering for events"]
};

function buildContext(products) {
  const menu = products.filter((p) => p.category !== "addon");
  const topSellers = products.filter((p) => p.tags && p.tags.includes("top-seller"));
  const favourites = products.filter((p) => p.tags && p.tags.includes("customer-favourite"));
  const bestRated = [...menu].sort((a, b) => b.rating - a.rating).slice(0, 3);
  const cheapest = [...menu].sort((a, b) => a.price - b.price).slice(0, 3);
  const totalReviews = menu.reduce((s, p) => s + (p.reviews || 0), 0);
  const avgRating = menu.length
    ? menu.reduce((s, p) => s + (p.rating || 0), 0) / menu.length
    : 0;
  return { menu, topSellers, favourites, bestRated, cheapest, totalReviews, avgRating };
}

function list(items, n = 4) {
  return items.slice(0, n).map(
    (p) => `• ${p.name} — £${p.price.toFixed(2)}${p.rating ? ` (${p.rating}★, ${p.reviews} reviews)` : ""}`
  );
}

function answer(question, ctx) {
  const q = (question || "").toLowerCase();
  const has = (...words) => words.some((w) => q.includes(w));
  const byDiet = (d) => ctx.menu.filter((p) => p.dietary && p.dietary.includes(d));
  const byCat = (c) => ctx.menu.filter((p) => p.category === c);
  const pickProducts = (arr, n = 4) =>
    arr.slice(0, n).map((p) => ({ id: p._id, name: p.name, price: p.price, image: p.image }));

  let text = "";
  let products = [];

  if (has("vegan", "plant")) {
    const items = byDiet("vegan");
    text = items.length
      ? `Here are our vegan options at ${SITE.name}:\n${list(items)}`
      : `We don't have a match, but our top picks are:\n${list(ctx.bestRated)}`;
    products = pickProducts(items);
  } else if (has("vegetarian", "veggie")) {
    const items = byDiet("vegetarian");
    text = `Our vegetarian choices:\n${list(items)}`;
    products = pickProducts(items);
  } else if (has("gluten")) {
    const items = byDiet("gluten-free");
    text = `Gluten-free options on the menu:\n${list(items)}`;
    products = pickProducts(items);
  } else if (has("halal")) {
    const items = byDiet("halal");
    text = `Yes — all our chicken is halal. Examples:\n${list(items)}`;
    products = pickProducts(items);
  } else if (has("spicy", "spice", "hot", "chilli", "piri", "heat")) {
    const items = ctx.menu.filter((p) => (p.spiceLevel || 0) >= 3);
    text = `If you like it hot, try these (spice level 3+):\n${list(items)}`;
    products = pickProducts(items);
  } else if (has("best", "top", "popular", "favourite", "bestseller", "recommend", "suggest", "should i", "try")) {
    const picks = ctx.topSellers.length ? ctx.topSellers : ctx.bestRated;
    text = `Our most-loved items${
      ctx.favourites.length ? " (customer favourites)" : ""
    }:\n${list(picks)}\n\nHighly rated right now:\n${list(ctx.bestRated)}`;
    products = pickProducts(picks);
  } else if (has("cheap", "price", "cost", "affordable", "budget", "deal", "value")) {
    text = `Best value picks:\n${list(ctx.cheapest)}`;
    products = pickProducts(ctx.cheapest);
  } else if (has("dessert", "sweet", "ice")) {
    text = `Sweet endings:\n${list(byCat("desserts"))}`;
    products = pickProducts(byCat("desserts"));
  } else if (has("drink", "beverage", "soft")) {
    text = `Drinks:\n${list(byCat("drinks"))}`;
    products = pickProducts(byCat("drinks"));
  } else if (has("side")) {
    text = `Sides:\n${list(byCat("sides"))}`;
    products = pickProducts(byCat("sides"));
  } else if (has("platter", "family", "share", "feast")) {
    text = `Sharing platters:\n${list(byCat("platters"))}`;
    products = pickProducts(byCat("platters"));
  } else if (has("kid", "child", "children", "family")) {
    text = `Kids & family:\n${list(byCat("kids"))}`;
    products = pickProducts(byCat("kids"));
  } else if (has("delivery", "collect", "order", "how do i", "buy", "get")) {
    text = SITE.ordering;
  } else if (has("store", "location", "nearest", "branch", "where", "address")) {
    text = SITE.stores;
  } else if (has("hour", "open", "close", "time")) {
    text = SITE.hours;
  } else if (has("contact", "phone", "email", "reach")) {
    text = SITE.contact;
  } else if (has("review", "feedback", "rating", "star")) {
    text = `${SITE.name} averages ${ctx.avgRating.toFixed(1)}★ across ${
      ctx.totalReviews
    } reviews. Customer favourites:\n${list(ctx.favourites)}`;
    products = pickProducts(ctx.favourites);
  } else if (has("menu", "category", "what do you sell", "offer")) {
    text = `Our menu includes: Grilled, Fried, Vegetarian, Platters, Kids, Sides, Dips, Desserts and Drinks. Popular right now:\n${list(
      ctx.topSellers.length ? ctx.topSellers : ctx.bestRated
    )}`;
    products = pickProducts(ctx.topSellers.length ? ctx.topSellers : ctx.bestRated);
  } else {
    text = `Hi! I'm the ${SITE.name} assistant. I can help with our menu, top sellers, best-rated and customer-favourite items, dietary options (vegan, vegetarian, gluten-free, halal), prices, delivery and stores. Try asking:\n• What's your most popular item?\n• Any vegan options?\n• What's the spiciest thing?\n• Recommend something for me`;
  }

  return { answer: text, products };
}

router.post("/ask", aiLimiter, async (req, res, next) => {
  try {
    const products = await Product.find({});
    const ctx = buildContext(products);
    const result = answer(req.body.question, ctx);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
