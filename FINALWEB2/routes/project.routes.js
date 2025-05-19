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

/**
 * @swagger
 * tags:
 *   name: Proyectos
 *   description: Gestión de Proyectos
 */

/**
 * @swagger
 * /api/project:
 *   post:
 *     summary: Crear un nuevo proyecto
 *     security:
 *       - bearerAuth: []
 *     tags: [Proyectos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               cliente:
 *                 type: string
 *     responses:
 *       201:
 *         description: Proyecto creado correctamente
 *       400:
 *         description: Error de validación
 */
router.post("/", verifyToken, createProjectValidator, createProject);

router.get("/", verifyToken, listProjects);

/**
 * @swagger
 * /api/project/{id}:
 *   get:
 *     summary: Obtener un proyecto por ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Proyectos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del proyecto
 *     responses:
 *       200:
 *         description: Proyecto encontrado
 *       404:
 *         description: Proyecto no encontrado
 */
router.get("/:id", verifyToken, projectIdValidator, getProjectById);

/**
 * @swagger
 * /api/project/{id}:
 *   put:
 *     summary: Actualizar un proyecto
 *     security:
 *       - bearerAuth: []
 *     tags: [Proyectos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del proyecto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *     responses:
 *       200:
 *         description: Proyecto actualizado correctamente
 *       404:
 *         description: Proyecto no encontrado
 */
router.put("/:id", verifyToken, projectIdValidator, updateProjectValidator, updateProject);

/**
 * @swagger
 * /api/project/{id}:
 *   delete:
 *     summary: Eliminar un proyecto (Soft o Hard Delete)
 *     security:
 *       - bearerAuth: []
 *     tags: [Proyectos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del proyecto
 *       - in: query
 *         name: hard
 *         required: false
 *         schema:
 *           type: boolean
 *         description: Si es true, elimina permanentemente (hard delete)
 *     responses:
 *       200:
 *         description: Proyecto eliminado (soft o hard)
 *       404:
 *         description: Proyecto no encontrado
 */
router.delete("/:id", verifyToken, projectIdValidator, deleteProject);

/**
 * @swagger
 * /api/project/archived:
 *   get:
 *     summary: Listar proyectos archivados
 *     security:
 *       - bearerAuth: []
 *     tags: [Proyectos]
 *     responses:
 *       200:
 *         description: Lista de proyectos archivados
 */
router.get("/archived", verifyToken, listArchivedProjects);

/**
 * @swagger
 * /api/project/{id}/restore:
 *   patch:
 *     summary: Restaurar un proyecto archivado
 *     security:
 *       - bearerAuth: []
 *     tags: [Proyectos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del proyecto
 *     responses:
 *       200:
 *         description: Proyecto restaurado
 *       404:
 *         description: Proyecto no encontrado
 */
router.patch("/:id/restore", verifyToken, projectIdValidator, restoreProject);

module.exports = router;
