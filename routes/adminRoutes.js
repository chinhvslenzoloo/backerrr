const express = require("express");
const upload = require("../middlewares/uploadMiddleware");
const {
  getAllUsers,
  createProduct,
  updateProduct,
  deleteUser,
  createCategory,
  deleteProduct,
  deleteCategory,
  getAllProducts,
  getAllCategories,
} = require("../Controllers/adminController");
const authMiddleware = require("../middlewares/authMiddleware");
const isAdmin = require("../middlewares/isAdmin");

const router = express.Router();

router.get("/admins", authMiddleware, isAdmin, getAllUsers);
router.post(
  "/products",
  authMiddleware,
  isAdmin,
  upload.single("imageUrl"),
  createProduct
);
router.put(
  "/product/:productId",
  authMiddleware,
  isAdmin,
  upload.single("imageUrl"),
  updateProduct
);
router.delete("/product/:productId", authMiddleware, isAdmin, deleteProduct);
router.delete("/user/:userId", authMiddleware, isAdmin, deleteUser);
router.post("/category", authMiddleware, isAdmin, createCategory);
router.delete("/category/:categoryId", authMiddleware, isAdmin, deleteCategory);
router.get("/products", authMiddleware, isAdmin, getAllProducts);
router.get("/categories", authMiddleware, isAdmin, getAllCategories);

module.exports = router;
