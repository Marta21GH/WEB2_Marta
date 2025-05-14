const { body, param } = require("express-validator");

// Validación para crear un albarán
const createDeliveryNoteValidator = [
  body("tipo")
    .notEmpty()
    .withMessage("El tipo de albarán es obligatorio")
    .isIn(["horas", "materiales"])
    .withMessage("El tipo debe ser 'horas' o 'materiales'"),
  body("descripcion")
    .optional()
    .isString()
    .withMessage("La descripción debe ser un texto"),
  body("horas")
    .if(body("tipo").equals("horas"))
    .notEmpty()
    .withMessage("Las horas son obligatorias para albaranes de tipo 'horas'")
    .isNumeric()
    .withMessage("Las horas deben ser un número positivo"),
  body("materiales")
    .if(body("tipo").equals("materiales"))
    .isArray({ min: 1 })
    .withMessage("Debe proporcionar al menos un material"),
  body("materiales.*.nombre")
    .if(body("tipo").equals("materiales"))
    .notEmpty()
    .withMessage("El nombre del material es obligatorio")
    .isString()
    .withMessage("El nombre del material debe ser un texto"),
  body("materiales.*.cantidad")
    .if(body("tipo").equals("materiales"))
    .notEmpty()
    .withMessage("La cantidad del material es obligatoria")
    .isNumeric()
    .withMessage("La cantidad debe ser un número positivo"),
  body("proyecto")
    .notEmpty()
    .withMessage("El ID del proyecto es obligatorio")
    .isMongoId()
    .withMessage("El ID del proyecto no es válido")
];

// Validación para actualizar un albarán
const updateDeliveryNoteValidator = [
  body("descripcion")
    .optional()
    .isString()
    .withMessage("La descripción debe ser un texto"),
  body("horas")
    .optional()
    .isNumeric()
    .withMessage("Las horas deben ser un número positivo"),
  body("materiales")
    .optional()
    .isArray()
    .withMessage("El campo materiales debe ser un array"),
  body("materiales.*.nombre")
    .optional()
    .isString()
    .withMessage("El nombre del material debe ser un texto"),
  body("materiales.*.cantidad")
    .optional()
    .isNumeric()
    .withMessage("La cantidad debe ser un número positivo")
];

// Validación para el ID del albarán
const deliveryNoteIdValidator = [
  param("id")
    .isMongoId()
    .withMessage("El ID del albarán no es válido")
];

module.exports = {
  createDeliveryNoteValidator,
  updateDeliveryNoteValidator,
  deliveryNoteIdValidator
};
