const connectDB = require('./config/db');
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

connectDB();

// Importar rutas
const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.routes");
const clientRoutes = require("./routes/client.routes"); // NUEVO

// Inicializar la aplicación
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Servir carpeta de uploads
app.use("/uploads", express.static("uploads"));

// Rutas
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/client", clientRoutes); // NUEVO

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({ message: "API funcionando correctamente" });
});

module.exports = app;
