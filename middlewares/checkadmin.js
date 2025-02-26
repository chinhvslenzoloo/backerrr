const checkAdminRole = (req, res, next) => {
  const user = req.user;

  if (user.role !== "admin") {
    return res.status(403).json({ message: "Access forbidden: Admins only" });
  }

  next();
};

app.use("/admin", checkAdminRole);
