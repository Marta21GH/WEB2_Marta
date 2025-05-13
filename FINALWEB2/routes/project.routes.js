const express = require("express");
const {
  createProject,
  updateProject,
  listProjects,
  getProjectById,
  deleteProject,
  listArchivedProjects,
  restoreProject,
} = require("../controllers/project.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const {
  createProjectValidator,
  updateProjectValidator,
  projectIdValidator,
} = require("../validators/project.validator");

const router = express.Router();

// RUTA DE PROYECTOS ARCHIVADOS - DEBE ESTAR ANTES QUE /:id
router.get("/archived", verifyToken, listArchivedProjects);

// Crear Proyecto
router.post("/", verifyToken, createProjectValidator, createProject);

// Actualizar Proyecto
router.put("/:id", verifyToken, projectIdValidator, updateProject);

// Obtener Proyecto por ID
router.get("/:id", verifyToken, projectIdValidator, getProjectById);

// Eliminar Proyecto (Soft/Hard)
router.delete("/:id", verifyToken, projectIdValidator, deleteProject);

// Restaurar Proyecto Archivado
router.patch("/:id/restore", verifyToken, projectIdValidator, restoreProject);

// Listar Todos los Proyectos
router.get("/", verifyToken, listProjects);

module.exports = router;
