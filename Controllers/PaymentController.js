const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
require("dotenv").config();

class PaymentController {
  static getStatus(req, res) {
    res.send("✅ Сервер ажиллаж байна!");
  }

  static async createPaymentIntent(req, res) {
    try {
      const { amount, currency } = req.body;

      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
      });

      res.send({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }
}

module.exports = PaymentController;
