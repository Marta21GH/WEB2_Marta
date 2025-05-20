const Client = require("../models/client.model");
const { validationResult } = require("express-validator");

// Crear Cliente
const createClient = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { nombre, email, telefono, direccion } = req.body;
    const usuarioId = req.user.id;

    // Verificar si el cliente ya existe para el usuario
    const existingClient = await Client.findOne({ email, usuario: usuarioId });
    if (existingClient) {
      return res.status(409).json({ message: "El cliente ya está registrado." });
    }

    const newClient = new Client({
      nombre,
      email,
      telefono,
      direccion,
      usuario: usuarioId,
    });

    await newClient.save();
    res.status(201).json({ message: "Cliente creado correctamente", client: newClient });
  } catch (error) {
    console.error("Error al crear cliente:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// Actualizar cliente
const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = req.user.id;
    const updatedClient = await Client.findOneAndUpdate(
      { _id: id, usuario: usuarioId },
      req.body,
      { new: true }
    );
    if (!updatedClient) return res.status(404).json({ message: "Cliente no encontrado" });
    res.status(200).json({ message: "Cliente actualizado", client: updatedClient });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
};


// Listar Todos los Clientes Activos
const listClients = async (req, res) => {
  try {
    const usuarioId = req.user.id;
    const clients = await Client.find({ usuario: usuarioId, archivado: false });
    res.status(200).json(clients);
  } catch (error) {
    console.error("Error al listar clientes:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// Obtener cliente por ID
const getClientById = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = req.user.id;
    const client = await Client.findOne({ _id: id, usuario: usuarioId });
    if (!client) return res.status(404).json({ message: "Cliente no encontrado" });
    res.status(200).json(client);
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// Eliminar cliente
const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = req.user.id;
    const deleted = await Client.findOneAndUpdate(
      { _id: id, usuario: usuarioId },
      { archivado: true },
      { new: true }
    );
    if (!deleted) return res.status(404).json({ message: "Cliente no encontrado" });
    res.status(200).json({ message: "Cliente archivado" });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// Listar Clientes Archivados
const listArchivedClients = async (req, res) => {
  try {
    const usuarioId = req.user.id;
    const clients = await Client.find({ usuario: usuarioId, archivado: true });
    res.status(200).json(clients);
  } catch (error) {
    console.error("Error al listar clientes archivados:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// Restaurar Cliente Archivado
const restoreClient = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await Client.findByIdAndUpdate(id, { archivado: false }, { new: true });

    if (!client) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    res.status(200).json({ message: "Cliente restaurado", client });
  } catch (error) {
    console.error("Error al restaurar cliente:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

module.exports = {
  createClient,
  updateClient,
  listClients,
  getClientById,
  deleteClient,
  listArchivedClients,
  restoreClient,
};
