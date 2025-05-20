const DeliveryNote = require("../models/deliverynote.model");
const Project = require("../models/project.model");
const { validationResult } = require("express-validator");
const generatePDF = require("../services/pdfGenerator");
const path = require("path");

// Crear Albarán
const createDeliveryNote = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { tipo, descripcion, horas, materiales, proyecto } = req.body;
    const usuarioId = req.user.id;

    // Verificar si el proyecto asociado existe
    const existingProject = await Project.findById(proyecto);
    if (!existingProject) {
      return res.status(404).json({ message: "Proyecto no encontrado" });
    }

    const newDeliveryNote = new DeliveryNote({
      tipo,
      descripcion,
      horas: tipo === "horas" ? horas : undefined,
      materiales: tipo === "materiales" ? materiales : undefined,
      proyecto,
      usuario: usuarioId,
    });

    await newDeliveryNote.save();
    res.status(201).json({ message: "Albarán creado correctamente", deliveryNote: newDeliveryNote });
  } catch (error) {
    console.error("Error al crear albarán:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// Actualizar albarán
const updateDeliveryNote = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = req.user.id;
    const deliveryNote = await DeliveryNote.findOneAndUpdate(
      { _id: id, usuario: usuarioId },
      req.body,
      { new: true }
    );
    if (!deliveryNote) return res.status(404).json({ message: "Albarán no encontrado" });
    res.status(200).json({ message: "Albarán actualizado", deliveryNote });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// Listar Todos los Albaranes Activos
const listDeliveryNotes = async (req, res) => {
  try {
    const usuarioId = req.user.id;
    const deliveryNotes = await DeliveryNote.find({ usuario: usuarioId, archivado: false }).populate("proyecto");
    res.status(200).json(deliveryNotes);
  } catch (error) {
    console.error("Error al listar albaranes:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// Obtener albarán por ID
const getDeliveryNoteById = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = req.user.id;
    const deliveryNote = await DeliveryNote.findOne({ _id: id, usuario: usuarioId }).populate("proyecto");
    if (!deliveryNote) return res.status(404).json({ message: "Albarán no encontrado" });
    res.status(200).json(deliveryNote);
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// Eliminar albarán
const deleteDeliveryNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { hard } = req.query;
    const usuarioId = req.user.id;

    const deliveryNote = await DeliveryNote.findOne({ _id: id, usuario: usuarioId });
    if (!deliveryNote) return res.status(404).json({ message: "Albarán no encontrado" });

    if (hard === "true") {
      await DeliveryNote.findByIdAndDelete(id);
      return res.status(200).json({ message: "Albarán eliminado permanentemente" });
    } else {
      await DeliveryNote.findByIdAndUpdate(id, { archivado: true });
      return res.status(200).json({ message: "Albarán archivado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// Listar Albaranes Archivados
const listArchivedDeliveryNotes = async (req, res) => {
  try {
    const usuarioId = req.user.id;
    const deliveryNotes = await DeliveryNote.find({ usuario: usuarioId, archivado: true }).populate("proyecto");
    res.status(200).json(deliveryNotes);
  } catch (error) {
    console.error("Error al listar albaranes archivados:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// Restaurar Albarán Archivado
const restoreDeliveryNote = async (req, res) => {
  try {
    const { id } = req.params;
    const deliveryNote = await DeliveryNote.findByIdAndUpdate(id, { archivado: false }, { new: true });

    if (!deliveryNote) {
      return res.status(404).json({ message: "Albarán no encontrado" });
    }

    res.status(200).json({ message: "Albarán restaurado", deliveryNote });
  } catch (error) {
    console.error("Error al restaurar albarán:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// Generar PDF del Albarán
const generateDeliveryNotePDF = async (req, res) => {
  try {
    const { id } = req.params;
    const deliveryNote = await DeliveryNote.findById(id).populate("proyecto usuario");

    if (!deliveryNote) {
      return res.status(404).json({ message: "Albarán no encontrado" });
    }

    const pdfUrl = await generatePDF(deliveryNote);
    deliveryNote.pdfUrl = pdfUrl;
    await deliveryNote.save();

    res.status(200).json({ message: "PDF generado correctamente", pdfUrl });
  } catch (error) {
    console.error("Error al generar PDF:", error);
    res.status(500).json({ message: "Error al generar el PDF" });
  }
};

// Descargar PDF del Albarán
const downloadPDF = async (req, res) => {
  try {
    const { id } = req.params;
    const deliveryNote = await DeliveryNote.findById(id);
    if (!deliveryNote || !deliveryNote.pdfUrl) {
      return res.status(404).json({ message: "PDF no encontrado" });
    }

    const filePath = path.join(__dirname, "..", deliveryNote.pdfUrl);
    res.download(filePath);
  } catch (error) {
    console.error("Error al descargar PDF:", error);
    res.status(500).json({ message: "Error al descargar el PDF" });
  }
};

module.exports = {
  createDeliveryNote,
  updateDeliveryNote,
  listDeliveryNotes,
  getDeliveryNoteById,
  deleteDeliveryNote,
  listArchivedDeliveryNotes,
  restoreDeliveryNote,
  generateDeliveryNotePDF, 
  downloadPDF,            
};