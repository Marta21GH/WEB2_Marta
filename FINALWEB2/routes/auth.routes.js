const express = require("express");
const { register, validateEmail, login } = require("../controllers/auth.controller");
const { registerValidator, validateEmailCodeValidator, loginValidator } = require("../validators/auth.validator");
const { verifyToken } = require("../middlewares/auth.middleware");

const router = express.Router();

// Ruta de prueba
router.get("/", (req, res) => {
  res.json({ message: "Auth route is working!" });
});

// Ruta para registrar usuarios
router.post("/register", registerValidator, register);

// Nueva ruta para validar email:
router.post("/validate", verifyToken, validateEmailCodeValidator, validateEmail);

router.post("/login", loginValidator, login);

module.exports = router;
