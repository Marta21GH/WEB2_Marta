const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String },
  cliente: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  archivado: { type: Boolean, default: false },
  fechaCreacion: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Project", ProjectSchema);
