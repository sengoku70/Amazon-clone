import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
    addAddress,
    deleteAddress,
    deleteAccount,
    deleteData
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/addresses", authMiddleware, addAddress);
router.delete("/addresses/:addressId", authMiddleware, deleteAddress);
router.delete("/account", authMiddleware, deleteAccount);
router.delete("/data", authMiddleware, deleteData);

export default router;
