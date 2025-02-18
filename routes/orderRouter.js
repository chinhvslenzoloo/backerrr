const express = require("express");
const {
  createOrder,
  getUserOrders,
  updateOrderStatus,
} = require("../Controllers/orderController");

const router = express.Router();

// Route to create an order
router.post("/", createOrder);

// Route to get orders for a user
router.get("/:userId", getUserOrders);

// Route to update order status
router.put("/:orderId", updateOrderStatus);

module.exports = router;
