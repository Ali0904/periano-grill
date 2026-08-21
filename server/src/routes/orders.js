import express from "express";
import OrderMod from "../models/Order.js";
import ProductMod from "../models/Product.js";
const Order = OrderMod.default ?? OrderMod;
const Product = ProductMod.default ?? ProductMod;
import { auth, admin } from "../middleware/auth.js";

const router = express.Router();

// POST /api/orders  (auth required)
router.post("/", auth, async (req, res, next) => {
  try {
    const { items, deliveryType, address, phone } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Order must contain at least one item" });
    }

    // Re-price from the database to avoid client tampering
    let total = 0;
    const orderItems = [];
    for (const it of items) {
      const product = await Product.findById(it.product);
      if (!product || !product.available) {
        return res.status(400).json({ error: `Product unavailable: ${it.product}` });
      }
      const qty = Math.max(1, parseInt(it.quantity, 10) || 1);
      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: qty
      });
      total += product.price * qty;
    }

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      total,
      deliveryType: deliveryType || "delivery",
      address: address || "",
      phone: phone || ""
    });

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
});

// GET /api/orders/me  (auth required)
router.get("/me", auth, async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

// GET /api/orders  (admin only)
router.get("/", auth, admin, async (req, res, next) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).populate("user", "name email");
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

export default router;
