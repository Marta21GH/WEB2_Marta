const { body, param } = require("express-validator");

const createClientValidator = [
  body("nombre")
    .notEmpty()
    .withMessage("El nombre es obligatorio"),
  body("email")
    .isEmail()
    .withMessage("El correo electrónico no es válido"),
  body("telefono")
    .optional()
    .isNumeric()
    .withMessage("El teléfono debe contener solo números"),
  body("direccion")
    .optional()
    .isString()
    .withMessage("La dirección debe ser un texto")
];

const updateClientValidator = [
  body("nombre")
    .optional()
    .notEmpty()
    .withMessage("El nombre no puede estar vacío"),
  body("email")
    .optional()
    .isEmail()
    .withMessage("El correo electrónico no es válido"),
  body("telefono")
    .optional()
    .isNumeric()
    .withMessage("El teléfono debe contener solo números"),
  body("direccion")
    .optional()
    .isString()
    .withMessage("La dirección debe ser un texto")
];

const clientIdValidator = [
  param("id")
    .isMongoId()
    .withMessage("El ID del cliente no es válido")
];

module.exports = {
  createClientValidator,
  updateClientValidator,
  clientIdValidator
};
