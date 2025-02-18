const multer = require("multer");
const path = require("path");

// Файлыг хадгалах тохиргоо
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "file/"); // Зургийг хадгалах хавтас
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // Файлын өргөтгөл
    cb(null, Date.now() + ext); // Нэрийг цагийн тэмдэгтээр өөрчлөх
  },
});

// Хүлээн авах зөвшөөрөгдсөн файлууд
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Тодорхой төрлийн зураг оруулна уу!"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {fileSize: 10 * 1024 * 1024}, // 10MB хүртэл файлуудыг хүлээн авна
});

module.exports = upload;
