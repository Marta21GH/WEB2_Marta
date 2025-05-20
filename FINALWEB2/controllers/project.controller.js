const Project = require("../models/project.model");
const { validationResult } = require("express-validator");

// Crear Proyecto
const createProject = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { nombre, descripcion, cliente } = req.body;
    const usuarioId = req.user.id;

    // Verificar si el proyecto ya existe para el usuario
    const existingProject = await Project.findOne({ nombre, usuario: usuarioId, cliente });
    if (existingProject) {
      return res.status(409).json({ message: "El proyecto ya está registrado." });
    }

    const newProject = new Project({
      nombre,
      descripcion,
      cliente,
      usuario: usuarioId,
    });

    await newProject.save();
    res.status(201).json({ message: "Proyecto creado correctamente", project: newProject });
  } catch (error) {
    console.error("Error al crear proyecto:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// Actualizar proyecto
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = req.user.id;
    const updatedProject = await Project.findOneAndUpdate(
      { _id: id, usuario: usuarioId },
      req.body,
      { new: true }
    );
    if (!updatedProject) return res.status(404).json({ message: "Proyecto no encontrado" });
    res.status(200).json({ message: "Proyecto actualizado", project: updatedProject });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// Listar Todos los Proyectos Activos
const listProjects = async (req, res) => {
  try {
    const usuarioId = req.user.id;
    const projects = await Project.find({ usuario: usuarioId, archivado: false }).populate("cliente");
    res.status(200).json(projects);
  } catch (error) {
    console.error("Error al listar proyectos:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// Obtener proyecto por ID
const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = req.user.id;
    const project = await Project.findOne({ _id: id, usuario: usuarioId }).populate("cliente");
    if (!project) return res.status(404).json({ message: "Proyecto no encontrado" });
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// Eliminar proyecto
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = req.user.id;
    const deleted = await Project.findOneAndUpdate(
      { _id: id, usuario: usuarioId },
      { archivado: true },
      { new: true }
    );
    if (!deleted) return res.status(404).json({ message: "Proyecto no encontrado" });
    res.status(200).json({ message: "Proyecto archivado" });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// Listar Proyectos Archivados
const listArchivedProjects = async (req, res) => {
  try {
    const usuarioId = req.user.id;
    const projects = await Project.find({ usuario: usuarioId, archivado: true }).populate("cliente");
    res.status(200).json(projects);
  } catch (error) {
    console.error("Error al listar proyectos archivados:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// Restaurar Proyecto Archivado
const restoreProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndUpdate(id, { archivado: false }, { new: true });

    if (!project) {
      return res.status(404).json({ message: "Proyecto no encontrado" });
    }

    res.status(200).json({ message: "Proyecto restaurado", project });
  } catch (error) {
    console.error("Error al restaurar proyecto:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

module.exports = {
  createProject,
  updateProject,
  listProjects,
  getProjectById,
  deleteProject,
  listArchivedProjects,
  restoreProject,
};
