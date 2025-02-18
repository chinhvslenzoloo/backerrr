const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {PrismaClient} = require("@prisma/client");

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "YourSecretKey";

const registerAdmin = async (req, res) => {
  const {email, password} = req.body;

  try {
    const existingUser = await prisma.user.findUnique({where: {email}});

    if (existingUser) {
      return res.status(400).json({message: "Энэ имэйл бүртгэлтэй байна!"});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: "admin",
      },
    });

    res.status(201).json({message: "Админ амжилттай бүртгэгдлээ!", user});
  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Серверийн алдаа!"});
  }
};

const login = async (req, res) => {
  const {email, password} = req.body;

  try {
    const user = await prisma.user.findUnique({where: {email}});

    if (!user || user.role !== "admin") {
      return res.status(401).json({message: "Хандах эрхгүй!"});
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({message: "Нууц үг буруу байна!"});
    }

    const token = jwt.sign(
      {id: user.id, email: user.email, role: user.role},
      SECRET_KEY,
      {expiresIn: "1h"}
    );

    res.json({success: true, token, user});
  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Алдаа гарлаа!"});
  }
};
// const getAllAdmins = async (req, res) => {
//   try {
//     const admins = await prisma.user.findMany({
//       where: {role: "admin"},
//       select: {id: true, email: true, role: true},
//     });

//     res.json({success: true, admins});
//   } catch (error) {
//     console.error(error);
//     res
//       .status(500)
//       .json({message: "Админ хэрэглэгчийн мэдээллийг авахад алдаа гарлаа!"});
//   }
// };

module.exports = {registerAdmin, login};
