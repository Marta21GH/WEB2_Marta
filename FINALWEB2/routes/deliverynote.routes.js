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

// RUTA DE ALBARANES ARCHIVADOS - DEBE ESTAR ANTES QUE /:id
router.get("/archived", verifyToken, listArchivedDeliveryNotes);

// Crear Albarán
router.post("/", verifyToken, createDeliveryNoteValidator, createDeliveryNote);

// Actualizar Albarán
router.put("/:id", verifyToken, deliveryNoteIdValidator, updateDeliveryNoteValidator, updateDeliveryNote);

// Listar Todos los Albaranes
router.get("/", verifyToken, listDeliveryNotes);

// Obtener Albarán por ID
router.get("/:id", verifyToken, deliveryNoteIdValidator, getDeliveryNoteById);

// Eliminar Albarán (Soft/Hard)
router.delete("/:id", verifyToken, deliveryNoteIdValidator, deleteDeliveryNote);

// Restaurar Albarán Archivado
router.patch("/:id/restore", verifyToken, deliveryNoteIdValidator, restoreDeliveryNote);

// Generación de PDF del Albarán
router.post("/:id/pdf", verifyToken, deliveryNoteIdValidator, generateDeliveryNotePDF);

// Descargar PDF del Albarán
router.get("/:id/pdf", verifyToken, deliveryNoteIdValidator, downloadPDF);

module.exports = router;
