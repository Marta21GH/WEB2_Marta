const express = require("express");
const { register } = require("../controllers/auth.controller");
const { registerValidator } = require("../validators/auth.validator");

const router = express.Router();

// Ruta de prueba
router.get("/", (req, res) => {
  res.json({ message: "Auth route is working!" });
});

// Ruta para registrar usuarios
router.post("/register", registerValidator, register);

module.exports = router;
