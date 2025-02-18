const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productsRoutes");
const orderRoutes = require("./routes/orderRouter");
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET,POST,PUT,DELETE",
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());

app.use("/file", express.static(path.join(__dirname, "file")));

app.use("/admin", authRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/users", userRoutes);
app.use("/categories", categoryRoutes);
app.use("/admin", adminRoutes);

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
