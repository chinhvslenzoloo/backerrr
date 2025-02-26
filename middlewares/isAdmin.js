const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Та админ биш байна!" });
  }
  next();
};

module.exports = isAdmin;
