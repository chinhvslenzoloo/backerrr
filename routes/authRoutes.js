const express = require("express");
const {
  registerAdmin,
  login,
  getAllAdmins,
} = require("../Controllers/authController");

const router = express.Router();

router.post("/register-admin", registerAdmin);
router.post("/login", login);

module.exports = router;
