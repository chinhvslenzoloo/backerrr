const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class ProfitController {
  // Get profit report for all orders
  async getProfitReport(req, res) {
    try {
      const orders = await prisma.order.findMany({
        include: {
          orderItems: {
            include: { product: true },
          },
        },
      });

      const profitReport = orders.map((order) => {
        let orderProfit = 0;
        order.orderItems.forEach((item) => {
          const revenue = parseFloat(item.price) * item.quantity;
          const cost = parseFloat(item.product.costPrice) * item.quantity;
          orderProfit += revenue - cost;
        });

        return {
          orderId: order.id,
          totalRevenue: parseFloat(order.totalPrice),
          totalProfit: orderProfit,
          status: order.status,
          createdAt: order.createdAt,
        };
      });

      const totalRevenue = profitReport.reduce(
        (sum, order) => sum + order.totalRevenue,
        0
      );
      const totalProfit = profitReport.reduce(
        (sum, order) => sum + order.totalProfit,
        0
      );

      res.json({
        success: true,
        data: profitReport,
        summary: {
          totalRevenue: totalRevenue.toFixed(2),
          totalProfit: totalProfit.toFixed(2),
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error generating profit report",
        error: error.message,
      });
    }
  }

  // Get profit report by date range
  async getProfitByDateRange(req, res) {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Start date and end date are required",
      });
    }

    try {
      const orders = await prisma.order.findMany({
        where: {
          createdAt: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        },
        include: {
          orderItems: {
            include: { product: true },
          },
        },
      });

      const profitReport = orders.map((order) => {
        let orderProfit = 0;
        order.orderItems.forEach((item) => {
          const revenue = parseFloat(item.price) * item.quantity;
          const cost = parseFloat(item.product.costPrice) * item.quantity;
          orderProfit += revenue - cost;
        });

        return {
          orderId: order.id,
          totalRevenue: parseFloat(order.totalPrice),
          totalProfit: orderProfit,
          status: order.status,
          createdAt: order.createdAt,
        };
      });

      const totalRevenue = profitReport.reduce(
        (sum, order) => sum + order.totalRevenue,
        0
      );
      const totalProfit = profitReport.reduce(
        (sum, order) => sum + order.totalProfit,
        0
      );

      res.json({
        success: true,
        data: profitReport,
        summary: {
          totalRevenue: totalRevenue.toFixed(2),
          totalProfit: totalProfit.toFixed(2),
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error generating profit report",
        error: error.message,
      });
    }
  }

  // Get profit for a single order
  async getProfitByOrder(req, res) {
    const { orderId } = req.params;

    try {
      const order = await prisma.order.findUnique({
        where: { id: parseInt(orderId) },
        include: {
          orderItems: {
            include: { product: true },
          },
        },
      });

      if (!order) {
        return res
          .status(404)
          .json({ success: false, message: "Order not found" });
      }

      let orderProfit = 0;
      order.orderItems.forEach((item) => {
        const revenue = parseFloat(item.price) * item.quantity;
        const cost = parseFloat(item.product.costPrice) * item.quantity;
        orderProfit += revenue - cost;
      });

      res.json({
        success: true,
        data: {
          orderId: order.id,
          totalRevenue: parseFloat(order.totalPrice),
          totalProfit: orderProfit,
          status: order.status,
          createdAt: order.createdAt,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching order profit",
        error: error.message,
      });
    }
  }
}

module.exports = new ProfitController();
