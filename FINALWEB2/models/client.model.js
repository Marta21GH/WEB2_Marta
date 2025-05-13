const mongoose = require("mongoose");

const ClientSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  telefono: { type: String },
  direccion: { type: String },
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  compania: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  archivado: { type: Boolean, default: false },
  fechaCreacion: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Client", ClientSchema);
