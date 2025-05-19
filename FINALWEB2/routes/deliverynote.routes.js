const express = require("express");
const {
  createDeliveryNote,
  updateDeliveryNote,
  listDeliveryNotes,
  getDeliveryNoteById,
  deleteDeliveryNote,
  listArchivedDeliveryNotes,
  restoreDeliveryNote,
  generateDeliveryNotePDF, 
  downloadPDF,              
} = require("../controllers/deliverynote.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const {
  createDeliveryNoteValidator,
  updateDeliveryNoteValidator,
  deliveryNoteIdValidator,
} = require("../validators/deliverynote.validator");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Albaranes
 *   description: Gestión de Albaranes
 */

/**
 * @swagger
 * /api/deliverynote:
 *   post:
 *     summary: Crear un nuevo albarán
 *     security:
 *       - bearerAuth: []
 *     tags: [Albaranes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tipo:
 *                 type: string
 *                 enum: [horas, materiales]
 *               descripcion:
 *                 type: string
 *               horas:
 *                 type: number
 *               materiales:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     nombre:
 *                       type: string
 *                     cantidad:
 *                       type: number
 *               proyecto:
 *                 type: string
 *     responses:
 *       201:
 *         description: Albarán creado correctamente
 *       400:
 *         description: Error de validación
 */
router.post("/", verifyToken, createDeliveryNoteValidator, createDeliveryNote);

/**
 * @swagger
 * /api/deliverynote:
 *   get:
 *     summary: Listar todos los albaranes
 *     security:
 *       - bearerAuth: []
 *     tags: [Albaranes]
 *     responses:
 *       200:
 *         description: Lista de albaranes
 */
router.get("/", verifyToken, listDeliveryNotes);

/**
 * @swagger
 * /api/deliverynote/{id}:
 *   get:
 *     summary: Obtener un albarán por ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Albaranes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del albarán
 *     responses:
 *       200:
 *         description: Albarán encontrado
 *       404:
 *         description: Albarán no encontrado
 */
router.get("/:id", verifyToken, deliveryNoteIdValidator, getDeliveryNoteById);

/**
 * @swagger
 * /api/deliverynote/{id}:
 *   put:
 *     summary: Actualizar un albarán existente
 *     security:
 *       - bearerAuth: []
 *     tags: [Albaranes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del albarán
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               descripcion:
 *                 type: string
 *               horas:
 *                 type: number
 *               materiales:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     nombre:
 *                       type: string
 *                     cantidad:
 *                       type: number
 *     responses:
 *       200:
 *         description: Albarán actualizado
 *       404:
 *         description: Albarán no encontrado
 */
router.put("/:id", verifyToken, deliveryNoteIdValidator, updateDeliveryNoteValidator, updateDeliveryNote);

/**
 * @swagger
 * /api/deliverynote/{id}:
 *   delete:
 *     summary: Eliminar un albarán (Soft o Hard Delete)
 *     security:
 *       - bearerAuth: []
 *     tags: [Albaranes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del albarán
 *       - in: query
 *         name: hard
 *         required: false
 *         schema:
 *           type: boolean
 *         description: Si es true, elimina permanentemente
 *     responses:
 *       200:
 *         description: Albarán eliminado (soft o hard)
 *       404:
 *         description: Albarán no encontrado
 */
router.delete("/:id", verifyToken, deliveryNoteIdValidator, deleteDeliveryNote);

/**
 * @swagger
 * /api/deliverynote/archived:
 *   get:
 *     summary: Listar albaranes archivados
 *     security:
 *       - bearerAuth: []
 *     tags: [Albaranes]
 *     responses:
 *       200:
 *         description: Lista de albaranes archivados
 */
router.get("/archived", verifyToken, listArchivedDeliveryNotes);

/**
 * @swagger
 * /api/deliverynote/{id}/restore:
 *   patch:
 *     summary: Restaurar un albarán archivado
 *     security:
 *       - bearerAuth: []
 *     tags: [Albaranes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del albarán
 *     responses:
 *       200:
 *         description: Albarán restaurado
 *       404:
 *         description: Albarán no encontrado
 */
router.patch("/:id/restore", verifyToken, deliveryNoteIdValidator, restoreDeliveryNote);

module.exports = router;
