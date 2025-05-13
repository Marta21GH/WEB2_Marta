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

// RUTA DE CLIENTES ARCHIVADOS - DEBE ESTAR ANTES QUE /:id
router.get("/archived", verifyToken, listArchivedClients);

// Crear Cliente
router.post("/", verifyToken, createClientValidator, createClient);

// Actualizar Cliente
router.put("/:id", verifyToken, clientIdValidator, updateClientValidator, updateClient);

// Obtener Cliente por ID
router.get("/:id", verifyToken, clientIdValidator, getClientById);

// Eliminar Cliente (Soft/Hard)
router.delete("/:id", verifyToken, clientIdValidator, deleteClient);

// Restaurar Cliente Archivado
router.patch("/:id/restore", verifyToken, clientIdValidator, restoreClient);

// Listar Todos los Clientes
router.get("/", verifyToken, listClients);

module.exports = router;
