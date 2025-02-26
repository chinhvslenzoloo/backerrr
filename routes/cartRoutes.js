const express = require("express");
const {
  getCartItems,
  addCartItem,
  removeCartItem,
} = require("./Controllers/cartController");
const router = express.Router();

router.get("/:userId/cart-items", getCartItems);
router.post("/cart-item", addCartItem);
router.delete("/cart-item/:cartItemId", removeCartItem);

module.exports = router;
