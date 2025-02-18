const express = require("express");
const {
  getCategories,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../Controllers/categoryController");
const router = express.Router();

router.get("/categories", getCategories);
router.post("/category", createCategory);
router.get("/category/:id", getCategoryById);

router.put("/category/:id", updateCategory);

router.delete("/category/:id", deleteCategory);

module.exports = router;
