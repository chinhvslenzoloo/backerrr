const express = require("express");
const {
  getProductById,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../Controllers/productsController");

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
