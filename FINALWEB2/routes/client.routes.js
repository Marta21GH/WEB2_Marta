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

/**
 * @swagger
 * tags:
 *   name: Clientes
 *   description: Gestión de Clientes
 */

/**
 * @swagger
 * /api/client:
 *   post:
 *     summary: Crear un nuevo cliente
 *     security:
 *       - bearerAuth: []
 *     tags: [Clientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               email:
 *                 type: string
 *               telefono:
 *                 type: string
 *               direccion:
 *                 type: string
 *     responses:
 *       201:
 *         description: Cliente creado correctamente
 *       400:
 *         description: Error de validación
 */
router.post("/", verifyToken, createClientValidator, createClient);

router.get("/", verifyToken, listClients);

/**
 * @swagger
 * /api/client/{id}:
 *   get:
 *     summary: Obtener un cliente por ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cliente
 *     responses:
 *       200:
 *         description: Cliente encontrado
 *       404:
 *         description: Cliente no encontrado
 */
router.get("/:id", verifyToken, clientIdValidator, getClientById);

/**
 * @swagger
 * /api/client/{id}:
 *   put:
 *     summary: Actualizar un cliente existente
 *     security:
 *       - bearerAuth: []
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               email:
 *                 type: string
 *               telefono:
 *                 type: string
 *               direccion:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cliente actualizado
 *       404:
 *         description: Cliente no encontrado
 */
router.put("/:id", verifyToken, clientIdValidator, updateClientValidator, updateClient);

/**
 * @swagger
 * /api/client/{id}:
 *   delete:
 *     summary: Eliminar un cliente (Soft o Hard Delete)
 *     security:
 *       - bearerAuth: []
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cliente
 *       - in: query
 *         name: hard
 *         required: false
 *         schema:
 *           type: boolean
 *         description: Si es true, elimina permanentemente (hard delete)
 *     responses:
 *       200:
 *         description: Cliente eliminado (soft o hard)
 *       404:
 *         description: Cliente no encontrado
 */
router.delete("/:id", verifyToken, clientIdValidator, deleteClient);

/**
 * @swagger
 * /api/client/archived:
 *   get:
 *     summary: Listar clientes archivados
 *     security:
 *       - bearerAuth: []
 *     tags: [Clientes]
 *     responses:
 *       200:
 *         description: Lista de clientes archivados
 */
router.get("/archived", verifyToken, listArchivedClients);

/**
 * @swagger
 * /api/client/{id}/restore:
 *   patch:
 *     summary: Restaurar un cliente archivado
 *     security:
 *       - bearerAuth: []
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cliente
 *     responses:
 *       200:
 *         description: Cliente restaurado
 *       404:
 *         description: Cliente no encontrado
 */
router.patch("/:id/restore", verifyToken, clientIdValidator, restoreClient);

module.exports = router;
