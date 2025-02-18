const express = require("express");
const {
  getCartItems,
  addCartItem,
  removeCartItem,
} = require("./Controllers/cartController");
const router = express.Router();

// Get all cart items for a user
router.get("/:userId/cart-items", getCartItems);

// Add an item to the cart
router.post("/cart-item", addCartItem);

// Remove an item from the cart
router.delete("/cart-item/:cartItemId", removeCartItem);

module.exports = router;
