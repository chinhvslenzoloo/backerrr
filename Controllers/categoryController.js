const prisma = require("@prisma/client");
const { PrismaClient } = prisma;
const prismaClient = new PrismaClient();

const getCategories = async (req, res) => {
  try {
    const categories = await prismaClient.category.findMany();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: "Error fetching categories" });
  }
};

const createCategory = async (req, res) => {
  const { name, description } = req.body;
  try {
    const category = await prismaClient.category.create({
      data: {
        name,
        description,
      },
    });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: "Error creating category" });
  }
};

const getCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await prismaClient.category.findUnique({
      where: { id: parseInt(id) },
    });
    if (category) {
      res.status(200).json(category);
    } else {
      res.status(404).json({ error: "Category not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error fetching category" });
  }
};

const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const category = await prismaClient.category.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
      },
    });
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: "Error updating category" });
  }
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await prismaClient.category.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).json({ message: "Category deleted", category });
  } catch (error) {
    res.status(500).json({ error: "Error deleting category" });
  }
};

module.exports = {
  getCategories,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
