// Example backend authentication middleware in Express.js
const checkAdminRole = (req, res, next) => {
  const user = req.user; // Assume user data is attached to req.user after authentication

  if (user.role !== "admin") {
    return res.status(403).json({message: "Access forbidden: Admins only"});
  }

  next(); // Proceed to next middleware or route
};

// Route that requires admin access
app.use("/admin", checkAdminRole);
