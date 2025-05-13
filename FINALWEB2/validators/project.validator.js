const { body, param } = require("express-validator");

// Validación para crear un proyecto
const createProjectValidator = [
  body("nombre")
    .notEmpty()
    .withMessage("El nombre del proyecto es obligatorio"),
  body("descripcion")
    .optional()
    .isString()
    .withMessage("La descripción debe ser un texto"),
  body("cliente")
    .isMongoId()
    .withMessage("El ID del cliente no es válido")
];

// Validación para actualizar un proyecto
const updateProjectValidator = [
  body("nombre")
    .optional()
    .notEmpty()
    .withMessage("El nombre no puede estar vacío"),
  body("descripcion")
    .optional()
    .isString()
    .withMessage("La descripción debe ser un texto"),
  body("cliente")
    .optional()
    .isMongoId()
    .withMessage("El ID del cliente no es válido")
];

// Validación para el ID del proyecto
const projectIdValidator = [
  param("id")
    .isMongoId()
    .withMessage("El ID del proyecto no es válido")
];

module.exports = {
  createProjectValidator,
  updateProjectValidator,
  projectIdValidator
};
