import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      enum: [
        "grilled",
        "fried",
        "vegetarian",
        "platters",
        "kids",
        "sides",
        "dips",
        "desserts",
        "drinks",
        "addon"
      ],
      default: "grilled"
    },
    spiceLevel: { type: Number, min: 0, max: 5, default: 0 },
    dietary: { type: [String], default: [] },
    rating: { type: Number, min: 0, max: 5, default: 4.5 },
    reviews: { type: Number, min: 0, default: 0 },
    tags: { type: [String], default: [] },
    image: { type: String, default: "" },
    available: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
