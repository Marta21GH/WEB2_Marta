const { body } = require("express-validator");

const registerValidator = [
  body("email").isEmail().withMessage("Email no válido"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener al menos 8 caracteres"),
];

module.exports = { registerValidator };
