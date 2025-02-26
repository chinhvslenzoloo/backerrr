const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.createOrder = async (req, res) => {
  const { userId, cartItems } = req.body;

  try {
    const orderItems = cartItems.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
    }));

    const order = await prisma.order.create({
      data: {
        user: { connect: { id: userId } },
        orderItems: {
          create: orderItems,
        },
        totalPrice: cartItems.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        ),
      },
    });

    await prisma.cartItem.deleteMany({ where: { userId } });

    res.status(201).json({ message: "Order created successfully!", order });
  } catch (error) {
    res.status(500).json({ error: "Failed to create order!" });
  }
};

exports.getUserOrders = async (req, res) => {
  const { userId } = req.params;

  try {
    const orders = await prisma.order.findMany({
      where: { userId: parseInt(userId) },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found!" });
    }

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: "Error fetching orders!" });
  }
};

exports.updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    const order = await prisma.order.update({
      where: { id: parseInt(orderId) },
      data: { status },
    });

    res
      .status(200)
      .json({ message: "Order status updated successfully!", order });
  } catch (error) {
    res.status(500).json({ error: "Failed to update order status!" });
  }
};

// Stripe Webhook хүлээн авалт
exports.handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const userId = paymentIntent.metadata.userId;
    const cartItems = JSON.parse(paymentIntent.metadata.cartItems);

    try {
      const orderItems = cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      }));

      const order = await prisma.order.create({
        data: {
          user: { connect: { id: userId } },
          orderItems: {
            create: orderItems,
          },
          totalPrice: cartItems.reduce(
            (total, item) => total + item.price * item.quantity,
            0
          ),
        },
      });

      await prisma.cartItem.deleteMany({ where: { userId } });

      res.status(200).json({ message: "Order created successfully!", order });
    } catch (error) {
      res.status(500).json({ error: "Failed to create order!" });
    }
  }

  res.status(200).json({ received: true });
};
