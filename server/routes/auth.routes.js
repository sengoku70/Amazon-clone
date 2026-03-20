import express from "express";
import User from "../models/User.js";
import {
  register,
  login,
  becomeSeller,
  logout,
} from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();
//import { protect } from "../middlewares/auth.middleware.js";

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        seller: user.seller || false,
        sellerProfile: user.sellerProfile || null,
        addresses: user.addresses || [],
      },
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

console.log("Auth routes loaded");
// auth
router.post("/register", register);
router.post("/login", login);
router.put("/become-seller", authMiddleware, becomeSeller);
router.post("/logout", logout);


export default router;