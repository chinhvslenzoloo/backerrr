const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = "file/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "file/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

const getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: { category: true },
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Error fetching products" });
  }
};

const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: { category: true },
    });

    if (!product) return res.status(404).json({ error: "Product not found" });

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: "Error fetching product by ID" });
  }
};

const createProduct = async (req, res) => {
  const { name, description, price, size, color, stockQuantity, categoryId } =
    req.body;

  try {
    const imageUrl = req.file ? `/file/${req.file.filename}` : null;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        size,
        color,
        stockQuantity: parseInt(stockQuantity),
        imageUrl,
        category: { connect: { id: parseInt(categoryId) } },
      },
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Error creating product" });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, size, color, stockQuantity, categoryId } =
    req.body;

  try {
    const imageUrl = req.file ? `/file/${req.file.filename}` : undefined;

    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        price: parseFloat(price),
        size,
        color,
        stockQuantity: parseInt(stockQuantity),
        ...(imageUrl && { imageUrl }),
        category: { connect: { id: parseInt(categoryId) } },
      },
    });

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: "Error updating product" });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: "Product deleted", product });
  } catch (error) {
    res.status(500).json({ error: "Error deleting product" });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct: [upload.single("imageUrl"), createProduct],
  updateProduct: [upload.single("imageUrl"), updateProduct],
  deleteProduct,
};
