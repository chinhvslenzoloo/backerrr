const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();

exports.getAllUsers = async (req, res) => {
  if (!req.user || req.user.role !== "admin") {
    return res
      .status(403)
      .json({message: "Та админ эрхтэй хэрэглэгч биш байна!"});
  }

  try {
    // Бүх хэрэглэгчийн мэдээллийг авах
    const user = await prisma.user.findMany();

    // Хэрэглэгчийн мэдээллийг буцаах
    res.json(user);
  } catch (error) {
    console.error("Алдаа гарлаа:", error);
    res.status(500).json({message: "Серверийн алдаа гарлаа!"});
  }
};

exports.createProduct = async (req, res) => {
  if (!req.user || req.user.role !== "admin") {
    return res
      .status(403)
      .json({message: "Та админ эрхтэй хэрэглэгч биш байна!"});
  }

  const {name, description, price, size, color, stockQuantity, categoryId} =
    req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  if (!name || !price || !categoryId) {
    return res
      .status(400)
      .json({message: "Бүтээгдэхүүний нэр, үнэ болон ангилал оруулна уу!"});
  }

  try {
    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        size,
        color,
        stockQuantity: parseInt(stockQuantity),
        imageBase64: imageUrl,
        categoryId: parseInt(categoryId),
      },
    });

    res.json({
      message: "Бүтээгдэхүүн амжилттай нэмэгдлээ!",
      product: newProduct,
    });
  } catch (error) {
    console.error("Алдаа гарлаа:", error);
    res.status(500).json({message: "Серверийн алдаа гарлаа!", error});
  }
};

exports.deleteUser = async (req, res) => {
  if (!req.user || req.user.role !== "admin") {
    return res
      .status(403)
      .json({message: "Та админ эрхтэй хэрэглэгч биш байна!"});
  }

  const {userId} = req.params;

  try {
    // Хэрэглэгчийг устгах
    const deletedUser = await prisma.user.delete({
      where: {id: parseInt(userId)},
    });

    res.json({message: "Хэрэглэгч амжилттай устгагдлаа!", user: deletedUser});
  } catch (error) {
    console.error("Алдаа гарлаа:", error);
    res.status(500).json({message: "Серверийн алдаа гарлаа!", error});
  }
};

exports.createCategory = async (req, res) => {
  if (!req.user || req.user.role !== "admin") {
    return res
      .status(403)
      .json({message: "Та админ эрхтэй хэрэглэгч биш байна!"});
  }

  const {name, description} = req.body;

  if (!name) {
    return res.status(400).json({message: "Категори нэрийг оруулна уу!"});
  }

  try {
    // Шинэ категори үүсгэх
    const newCategory = await prisma.category.create({
      data: {
        name,
        description,
      },
    });

    res.json({
      message: "Категори амжилттай нэмэгдлээ!",
      category: newCategory,
    });
  } catch (error) {
    console.error("Алдаа гарлаа:", error);
    res.status(500).json({message: "Серверийн алдаа гарлаа!", error});
  }
};

exports.deleteProduct = async (req, res) => {
  if (!req.user || req.user.role !== "admin") {
    return res
      .status(403)
      .json({message: "Та админ эрхтэй хэрэглэгч биш байна!"});
  }

  const {productId} = req.params;

  try {
    // Бүтээгдэхүүнийг устгах
    const deletedProduct = await prisma.product.delete({
      where: {id: parseInt(productId)},
    });

    res.json({
      message: "Бүтээгдэхүүн амжилттай устгагдлаа!",
      product: deletedProduct,
    });
  } catch (error) {
    console.error("Алдаа гарлаа:", error);
    res.status(500).json({message: "Серверийн алдаа гарлаа!", error});
  }
};

exports.deleteCategory = async (req, res) => {
  if (!req.user || req.user.role !== "admin") {
    return res
      .status(403)
      .json({message: "Та админ эрхтэй хэрэглэгч биш байна!"});
  }

  const {categoryId} = req.params;

  try {
    // Категорийг устгах
    const deletedCategory = await prisma.category.delete({
      where: {id: parseInt(categoryId)},
    });

    res.json({
      message: "Категори амжилттай устгагдлаа!",
      category: deletedCategory,
    });
  } catch (error) {
    console.error("Алдаа гарлаа:", error);
    res.status(500).json({message: "Серверийн алдаа гарлаа!", error});
  }
};

exports.updateProduct = async (req, res) => {
  if (!req.user || req.user.role !== "admin") {
    return res
      .status(403)
      .json({message: "Та админ эрхтэй хэрэглэгч биш байна!"});
  }

  const {productId} = req.params;
  const {name, description, price, size, color, stockQuantity, categoryId} =
    req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const existingProduct = await prisma.product.findUnique({
      where: {id: parseInt(productId)},
    });

    if (!existingProduct) {
      return res.status(404).json({message: "Бүтээгдэхүүн олдсонгүй!"});
    }

    const updatedProduct = await prisma.product.update({
      where: {id: parseInt(productId)},
      data: {
        name,
        description,
        price: parseFloat(price),
        size,
        color,
        stockQuantity: parseInt(stockQuantity),
        imageBase64: imageUrl || existingProduct.imageBase64, // Зураг байгаа бол шинэчилнэ
        categoryId: parseInt(categoryId),
      },
    });

    res.json({
      message: "Бүтээгдэхүүн амжилттай шинэчлэгдлээ!",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Алдаа гарлаа:", error);
    res.status(500).json({message: "Серверийн алдаа гарлаа!", error});
  }
};
exports.getAllProducts = async (req, res) => {
  if (!req.user || req.user.role !== "admin") {
    return res
      .status(403)
      .json({message: "Та админ эрхтэй хэрэглэгч биш байна!"});
  }

  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    console.error("Алдаа гарлаа:", error);
    res.status(500).json({message: "Серверийн алдаа гарлаа!"});
  }
};

exports.getAllCategories = async (req, res) => {
  if (!req.user || req.user.role !== "admin") {
    return res
      .status(403)
      .json({message: "Та админ эрхтэй хэрэглэгч биш байна!"});
  }

  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    console.error("Алдаа гарлаа:", error);
    res.status(500).json({message: "Серверийн алдаа гарлаа!"});
  }
};

module.exports = exports;
