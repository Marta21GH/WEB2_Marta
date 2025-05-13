const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  verified: { type: Boolean, default: false },
  role: { type: String, enum: ["admin", "user", "guest"], default: "user" },
  verificationCode: { type: String },
  verificationAttempts: { type: Number, default: 3 },
  nombre: { type: String },
  apellidos: { type: String },
  nif: { type: String },

  company: {
    nombreEmpresa: { type: String },
    cif: { type: String },
    direccion: { type: String },
    telefono: { type: String },
  },

  logoUrl: { type: String },
  active: { type: Boolean, default: true },
});

module.exports = mongoose.model("User", UserSchema);
