const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Definición de la configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Gestión de Clientes, Proyectos y Albaranes",
      version: "1.0.0",
      description: "Documentación de la API de gestión de clientes, proyectos y albaranes.",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor de Desarrollo",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js"], // Ruta de los archivos con anotaciones Swagger
};

// Inicializar Swagger con las opciones
const swaggerSpec = swaggerJSDoc(swaggerOptions);

module.exports = { swaggerUi, swaggerSpec };
