const { body, param } = require("express-validator");

const createProjectValidator = [
  body("nombre").notEmpty().withMessage("El nombre es obligatorio"),
  body("descripcion").optional().isString().withMessage("La descripción debe ser un texto"),
  body("cliente").notEmpty().withMessage("El ID del cliente es obligatorio"),
];

const updateProjectValidator = [
  body("nombre").optional().isString().withMessage("El nombre debe ser un texto"),
  body("descripcion").optional().isString().withMessage("La descripción debe ser un texto"),
];

const projectIdValidator = [
  param("id").isMongoId().withMessage("El ID del proyecto debe ser un ObjectId válido"),
];

module.exports = {
  createProjectValidator,
  updateProjectValidator,
  projectIdValidator,
};
