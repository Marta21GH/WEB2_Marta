const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { generateCode } = require("../utils/generateCode");

const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Verificar si el email ya está registrado
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "El email ya está registrado" });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generar código de verificación
    const verificationCode = generateCode(6); // Utilidad que genera un código aleatorio

    // Crear usuario en la BD
    const newUser = new User({
      email,
      password: hashedPassword,
      verificationCode,
    });

    await newUser.save();

    // Generar token JWT
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "Usuario registrado correctamente",
      user: {
        email: newUser.email,
        verified: newUser.verified,
        role: newUser.role,
      },
      token,
    });
  } catch (error) {
    console.error("Error en el registro:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

const validateEmail = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { code } = req.body;
    const userId = req.user.id; // obtenemos el ID desde el token JWT

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (user.verificationCode !== code) {
      return res.status(400).json({ message: "Código incorrecto" });
    }

    user.verified = true;
    user.verificationCode = null; // opcional: eliminar el código una vez validado
    await user.save();

    return res.status(200).json({ message: "Email verificado correctamente" });
  } catch (error) {
    console.error("Error en la validación de email:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Buscar usuario por email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Credenciales incorrectas" });
    }

    // Verificar que el email esté validado
    if (!user.verified) {
      return res.status(403).json({ message: "El email no ha sido validado" });
    }

    // Comparar contraseñas
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Credenciales incorrectas" });
    }

    // Generar nuevo token JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login correcto",
      user: {
        email: user.email,
        verified: user.verified,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Error en el login:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

module.exports = { register, validateEmail, login };