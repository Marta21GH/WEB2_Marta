const User = require("../models/user.model");
const { validationResult } = require("express-validator");

const updatePersonalData = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { nombre, apellidos, nif } = req.body;
    const userId = req.user.id;

    const user = await User.findByIdAndUpdate(
      userId,
      { nombre, apellidos, nif },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({
      message: "Datos personales actualizados correctamente",
      user: {
        email: user.email,
        nombre: user.nombre,
        apellidos: user.apellidos,
        nif: user.nif,
      },
    });
  } catch (error) {
    console.error("Error en el onboarding personal:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

const updateCompanyData = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { nombreEmpresa, cif, direccion, telefono } = req.body;
      const userId = req.user.id;
  
      const user = await User.findByIdAndUpdate(
        userId,
        {
          company: {
            nombreEmpresa,
            cif,
            direccion,
            telefono,
          },
        },
        { new: true }
      );
  
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
  
      res.status(200).json({
        message: "Datos de la compañía actualizados correctamente",
        company: user.company,
      });
    } catch (error) {
      console.error("Error en el onboarding de compañía:", error);
      res.status(500).json({ message: "Error en el servidor" });
    }
  };

  const uploadLogo = async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No se ha subido ningún archivo" });
      }
  
      const userId = req.user.id;
      const logoUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  
      const user = await User.findByIdAndUpdate(
        userId,
        { logoUrl },
        { new: true }
      );
  
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
  
      res.status(200).json({
        message: "Logo subido correctamente",
        logoUrl: user.logoUrl,
      });
    } catch (error) {
      console.error("Error al subir el logo:", error);
      res.status(500).json({ message: "Error en el servidor" });
    }
  };

  const getUserProfile = async (req, res) => {
    try {
      const userId = req.user.id;
  
      const user = await User.findById(userId).select("-password -verificationCode -verificationAttempts");
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
  
      res.status(200).json({
        message: "Datos del usuario obtenidos correctamente",
        user,
      });
    } catch (error) {
      console.error("Error al obtener los datos del usuario:", error);
      res.status(500).json({ message: "Error en el servidor" });
    }
  };  

  const deleteUser = async (req, res) => {
    try {
      const userId = req.user.id;
      const softDelete = req.query.soft !== "false"; // Si no pone false, será soft delete por defecto
  
      if (softDelete) {
        const user = await User.findByIdAndUpdate(userId, { active: false }, { new: true });
        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
  
        return res.status(200).json({ message: "Usuario desactivado correctamente (soft delete)" });
      } else {
        const user = await User.findByIdAndDelete(userId);
        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
  
        return res.status(200).json({ message: "Usuario eliminado definitivamente (hard delete)" });
      }
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
      res.status(500).json({ message: "Error en el servidor" });
    }
  };
  
module.exports = { updatePersonalData, updateCompanyData, uploadLogo, getUserProfile, deleteUser };