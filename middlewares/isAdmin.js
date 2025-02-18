// isAdmin.js
const isAdmin = (req, res, next) => {
  // req.user-д админ хэрэглэгчийн мэдээлэл байгаа гэдгийг шалгах
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({message: "Та админ биш байна!"});
  }
  next(); // Админ бол үргэлжлүүлнэ
};

module.exports = isAdmin;
