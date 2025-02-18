const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.createPaymentIntent = async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: "usd",
      payment_method_types: ["card"],
    });

    res.json({clientSecret: paymentIntent.client_secret});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};
