const express = require("express");
const {
  createClient,
  updateClient,
  listClients,
  getClientById,
  deleteClient,
  listArchivedClients,
  restoreClient,
} = require("../controllers/client.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const {
  createClientValidator,
  updateClientValidator,
  clientIdValidator,
} = require("../validators/client.validator");

const router = express.Router();

// Crear Cliente
router.post("/", verifyToken, createClientValidator, createClient);

// Actualizar Cliente
router.put("/:id", verifyToken, clientIdValidator, updateClientValidator, updateClient);

// Listar Todos los Clientes
router.get("/", verifyToken, listClients);

// Obtener Cliente por ID
router.get("/:id", verifyToken, clientIdValidator, getClientById);

// Eliminar Cliente (Soft/Hard)
router.delete("/:id", verifyToken, clientIdValidator, deleteClient);

// Listar Clientes Archivados
router.get("/archived", verifyToken, listArchivedClients);

// Recuperar Cliente Archivado
router.patch("/:id/restore", verifyToken, clientIdValidator, restoreClient);

module.exports = router;
