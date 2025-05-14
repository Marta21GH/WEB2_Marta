const DeliveryNote = require("../models/deliverynote.model");
const Project = require("../models/project.model");
const { validationResult } = require("express-validator");

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

// Actualizar Albarán
const updateDeliveryNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { descripcion, horas, materiales, firmado } = req.body;

    const deliveryNote = await DeliveryNote.findByIdAndUpdate(
      id,
      { descripcion, horas, materiales, firmado },
      { new: true }
    );

    if (!deliveryNote) {
      return res.status(404).json({ message: "Albarán no encontrado" });
    }

    res.status(200).json({ message: "Albarán actualizado", deliveryNote });
  } catch (error) {
    console.error("Error al actualizar albarán:", error);
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

// Obtener Albarán por ID
const getDeliveryNoteById = async (req, res) => {
  try {
    const { id } = req.params;
    const deliveryNote = await DeliveryNote.findById(id).populate("proyecto");

    if (!deliveryNote) {
      return res.status(404).json({ message: "Albarán no encontrado" });
    }

    res.status(200).json(deliveryNote);
  } catch (error) {
    console.error("Error al obtener albarán:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// Eliminar Albarán (Soft/Hard Delete)
const deleteDeliveryNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { hard } = req.query;

    if (hard === "true") {
      await DeliveryNote.findByIdAndDelete(id);
      return res.status(200).json({ message: "Albarán eliminado permanentemente" });
    } else {
      await DeliveryNote.findByIdAndUpdate(id, { archivado: true }, { new: true });
      return res.status(200).json({ message: "Albarán archivado" });
    }
  } catch (error) {
    console.error("Error al eliminar albarán:", error);
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
    await DeliveryNote.findByIdAndUpdate(id, { archivado: false }, { new: true });
    res.status(200).json({ message: "Albarán restaurado" });
  } catch (error) {
    console.error("Error al restaurar albarán:", error);
    res.status(500).json({ message: "Error en el servidor" });
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
};
