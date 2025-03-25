const { body } = require("express-validator");

const personalDataValidator = [
  body("nombre").notEmpty().withMessage("El nombre es obligatorio"),
  body("apellidos").notEmpty().withMessage("Los apellidos son obligatorios"),
  body("nif")
    .matches(/^[0-9]{8}[A-Z]$/)
    .withMessage("El NIF debe tener 8 números y una letra mayúscula"),
];

const companyDataValidator = [
    body("nombreEmpresa").notEmpty().withMessage("El nombre de la empresa es obligatorio"),
    body("cif")
      .matches(/^[A-Z]\d{8}$/)
      .withMessage("El CIF debe empezar por letra mayúscula y tener 8 dígitos"),
    body("direccion").notEmpty().withMessage("La dirección es obligatoria"),
    body("telefono")
      .matches(/^[0-9]{9}$/)
      .withMessage("El teléfono debe tener 9 dígitos"),
  ];  

module.exports = { personalDataValidator, companyDataValidator };