const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getCartItems = async (req, res) => {
  const { userId } = req.params;

  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: parseInt(userId) },
      include: {
        product: true,
      },
    });

    if (cartItems.length === 0) {
      return res.status(404).json({ message: "No items in cart!" });
    }

    res.status(200).json(cartItems);
  } catch (error) {
    res.status(500).json({ error: "Error fetching cart items!" });
  }
};

exports.addCartItem = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    const existingItem = await prisma.cartItem.findFirst({
      where: { userId, productId },
    });

    if (existingItem) {
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });

      return res
        .status(200)
        .json({ message: "Cart item updated successfully!", updatedItem });
    }

    const newCartItem = await prisma.cartItem.create({
      data: {
        user: { connect: { id: userId } },
        product: { connect: { id: productId } },
        quantity,
      },
    });

    res
      .status(201)
      .json({ message: "Item added to cart successfully!", newCartItem });
  } catch (error) {
    res.status(500).json({ error: "Failed to add item to cart!" });
  }
};

exports.removeCartItem = async (req, res) => {
  const { cartItemId } = req.params;

  try {
    const cartItem = await prisma.cartItem.delete({
      where: { id: parseInt(cartItemId) },
    });

    res
      .status(200)
      .json({ message: "Item removed from cart successfully!", cartItem });
  } catch (error) {
    res.status(500).json({ error: "Failed to remove item from cart!" });
  }
};
