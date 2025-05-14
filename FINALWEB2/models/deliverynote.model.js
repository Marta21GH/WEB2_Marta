const mongoose = require("mongoose");

const MaterialSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  cantidad: { type: Number, required: true },
});

const DeliveryNoteSchema = new mongoose.Schema({
  tipo: { type: String, enum: ["horas", "materiales"], required: true },
  descripcion: { type: String },
  horas: { type: Number, min: 0 },
  materiales: [MaterialSchema],
  proyecto: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  firmado: { type: Boolean, default: false },
  pdfUrl: { type: String },
  fechaCreacion: { type: Date, default: Date.now },
  archivado: { type: Boolean, default: false },
});

module.exports = mongoose.model("DeliveryNote", DeliveryNoteSchema);
