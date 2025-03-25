const { body } = require("express-validator");

const registerValidator = [
  body("email").isEmail().withMessage("Email no válido"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener al menos 8 caracteres"),
];

const validateEmailCodeValidator = [
  body("code")
    .isLength({ min: 6, max: 6 })
    .withMessage("El código debe tener 6 dígitos")
    .isNumeric()
    .withMessage("El código solo debe contener números"),
];

const loginValidator = [
  body("email").isEmail().withMessage("Email no válido"),
  body("password")
    .notEmpty()
    .withMessage("La contraseña es obligatoria"),
];

module.exports = { registerValidator, validateEmailCodeValidator, loginValidator };