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

// Actualizar Proyecto
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;

    const project = await Project.findByIdAndUpdate(
      id,
      { nombre, descripcion },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: "Proyecto no encontrado" });
    }

    res.status(200).json({ message: "Proyecto actualizado", project });
  } catch (error) {
    console.error("Error al actualizar proyecto:", error);
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

// Obtener Proyecto por ID
const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id).populate("cliente");

    if (!project) {
      return res.status(404).json({ message: "Proyecto no encontrado" });
    }

    res.status(200).json(project);
  } catch (error) {
    console.error("Error al obtener proyecto:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// Eliminar Proyecto (Soft/Hard Delete)
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { hard } = req.query;

    if (hard === "true") {
      // Eliminación física (hard delete)
      await Project.findByIdAndDelete(id);
      return res.status(200).json({ message: "Proyecto eliminado permanentemente" });
    } else {
      // Eliminación lógica (soft delete)
      const project = await Project.findByIdAndUpdate(id, { archivado: true }, { new: true });
      if (!project) {
        return res.status(404).json({ message: "Proyecto no encontrado" });
      }
      return res.status(200).json({ message: "Proyecto archivado", project });
    }
  } catch (error) {
    console.error("Error al eliminar proyecto:", error);
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

// Recuperar Proyecto Archivado
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
