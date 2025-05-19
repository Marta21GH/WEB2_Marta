const connectDB = require('./config/db');
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

// Swagger
const { swaggerUi, swaggerSpec } = require("./config/swagger"); // Importar Swagger

connectDB();

// Importar rutas
const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.routes");
const clientRoutes = require("./routes/client.routes");
const projectRoutes = require("./routes/project.routes");
const deliveryNoteRoutes = require("./routes/deliverynote.routes"); // NUEVO

// Inicializar la aplicación
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Servir carpeta de uploads
app.use("/uploads", express.static("uploads"));

// Documentación Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
console.log("📑 Documentación Swagger disponible en: http://localhost:3000/api-docs");

// Rutas
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/client", clientRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/deliverynote", deliveryNoteRoutes); // NUEVO

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({ message: "API funcionando correctamente" });
});

module.exports = app;
