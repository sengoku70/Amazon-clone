import express from "express";
import {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus
} from "../controllers/order.controller.js";

const router = express.Router();

// create new order
router.post("/", createOrder);

// get all orders of a user
router.get("/user/:userId", getUserOrders);

// get single order
router.get("/:orderId", getOrderById);

// update order status (admin / seller)
router.put("/:orderId/status", updateOrderStatus);

export default router;
