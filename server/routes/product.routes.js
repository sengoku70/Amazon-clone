import express from "express";
import Product from "../models/Product.js";
import User from "../models/User.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const products = await Product.find().populate("seller", "name");
  res.json(products);
});

router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.json(product);
});

// Create a new product (authenticated users)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, price, image, description, category, countInStock } = req.body;
    const sellerId = req.user?.id || req.user?._id || req.user?.userId;

    const product = new Product({
      title,
      price,
      image,
      description,
      category,
      countInStock,
      seller: sellerId,
    });

    const saved = await product.save();

    // add product ref to the user document
    if (sellerId) {
      await User.findByIdAndUpdate(sellerId, { $push: { products: saved._id } });
    }

    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create product" });
  }
});

export default router;
