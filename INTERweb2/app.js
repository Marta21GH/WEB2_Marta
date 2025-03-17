const connectDB = require('./config/db');
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

connectDB();

// Importar rutas
const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.routes");

// Inicializar la aplicación
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Rutas
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({ message: "API funcionando correctamente" });
});

module.exports = app;
