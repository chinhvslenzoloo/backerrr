const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();

// Create a new order
exports.createOrder = async (req, res) => {
  const {userId, cartItems} = req.body; // userId and cart items should be passed in the body

  try {
    const orderItems = cartItems.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
    }));

    // Create a new order and associate it with the user
    const order = await prisma.order.create({
      data: {
        user: {connect: {id: userId}},
        orderItems: {
          create: orderItems,
        },
        totalPrice: cartItems.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        ), // Calculate total price
      },
    });

    // Clear the user's cart after creating the order
    await prisma.cartItem.deleteMany({where: {userId}});

    res.status(201).json({message: "Order created successfully!", order});
  } catch (error) {
    res.status(500).json({error: "Failed to create order!"});
  }
};

// Get all orders for a user
exports.getUserOrders = async (req, res) => {
  const {userId} = req.params;

  try {
    const orders = await prisma.order.findMany({
      where: {userId: parseInt(userId)},
      include: {
        orderItems: {
          include: {
            product: true, // Include product details in the order item response
          },
        },
      },
    });

    if (orders.length === 0) {
      return res.status(404).json({message: "No orders found!"});
    }

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({error: "Error fetching orders!"});
  }
};

// Update the status of an order
exports.updateOrderStatus = async (req, res) => {
  const {orderId} = req.params;
  const {status} = req.body;

  try {
    const order = await prisma.order.update({
      where: {id: parseInt(orderId)},
      data: {status},
    });

    res
      .status(200)
      .json({message: "Order status updated successfully!", order});
  } catch (error) {
    res.status(500).json({error: "Failed to update order status!"});
  }
};
