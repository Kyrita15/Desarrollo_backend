const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

// Registrar usuario
const registrarUsuario = async (req, res) => {
  try {
    const { nombre_completo, correo, cedula, sexo, telefono, password, rol } = req.body;

    // Verifica si el usuario ya existe
    const usuarioExistente = await userModel.buscarPorCorreo(correo);
    if (usuarioExistente) {
      return res.status(400).json({ ok: false, msg: 'El correo ya está registrado' });
    }

    // Encripta la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crea el usuario
    const nuevoUsuario = await userModel.crearUsuario({
      nombre_completo,
      correo,
      cedula,
      sexo,
      telefono,
      password: hashedPassword,
      rol: rol || 'usuario', // por defecto es usuario
    });

    res.status(201).json({ ok: true, user: nuevoUsuario });
  } catch (error) {
    console.error("❌ Error al registrar usuario:", error);
    res.status(500).json({ ok: false, msg: 'Error al registrar usuario' });
  }
};

// Login
const loginUsuario = async (req, res) => {
  try {
    const { correo, password } = req.body;

    const usuario = await userModel.buscarPorCorreo(correo);
    if (!usuario) {
      return res.status(400).json({ ok: false, msg: 'Correo no encontrado' });
    }

    // Verifica la contraseña
    const passwordValido = await bcrypt.compare(password, usuario.password);
    if (!passwordValido) {
      return res.status(400).json({ ok: false, msg: 'Contraseña incorrecta' });
    }

    // Genera token
    const token = jwt.sign(
      { id: usuario.id, correo: usuario.correo, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '720h' }
    );

    res.status(200).json({
      ok: true,
      token,
      usuario: {
        id: usuario.id,
        nombre_completo: usuario.nombre_completo,
        rol: usuario.rol,
        correo: usuario.correo,
        cedula: usuario.cedula,
        sexo: usuario.sexo,
        telefono: usuario.telefono
      },
    });
  } catch (error) {
    console.error("❌ Error al iniciar sesión:", error);
    res.status(500).json({ ok: false, msg: 'Error al iniciar sesión' });
  }
};

// Actualizar datos de usuario
const actualizarUsuario = async (req, res) => {
  try {
    const usuarioId = req.params.id;
    const { nombre_completo, correo, cedula, sexo, telefono } = req.body;

    const usuarioActualizado = await userModel.actualizarUsuario(usuarioId, {
      nombre_completo,
      correo,
      cedula,
      sexo,
      telefono
    });

    if (!usuarioActualizado) {
      return res.status(404).json({ ok: false, msg: "Usuario no encontrado" });
    }

    res.json({ ok: true, usuario: usuarioActualizado });
  } catch (error) {
    console.error("❌ Error al actualizar usuario:", error);
    res.status(500).json({ ok: false, msg: "Error al actualizar usuario" });
  }
};

// 🆕 Listar todos los usuarios (admin)
const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await userModel.listarUsuarios();
    res.json({ ok: true, usuarios });
  } catch (error) {
    console.error("❌ Error al listar usuarios:", error);
    res.status(500).json({ ok: false, msg: "Error al listar usuarios" });
  }
};

// 🆕 Obtener usuario por ID
const obtenerUsuario = async (req, res) => {
  try {
    const usuarioId = req.params.id;
    const usuario = await userModel.obtenerUsuarioPorId(usuarioId);

    if (!usuario) {
      return res.status(404).json({ ok: false, msg: "Usuario no encontrado" });
    }

    res.json({ ok: true, usuario });
  } catch (error) {
    console.error("❌ Error al obtener usuario:", error);
    res.status(500).json({ ok: false, msg: "Error al obtener usuario" });
  }
};

// 🆕 Eliminar usuario por ID
const eliminarUsuario = async (req, res) => {
  try {
    const usuarioId = req.params.id;
    const usuarioEliminado = await userModel.eliminarUsuario(usuarioId);

    if (!usuarioEliminado) {
      return res.status(404).json({ ok: false, msg: "Usuario no encontrado" });
    }

    res.json({ ok: true, msg: "Usuario eliminado", usuario: usuarioEliminado });
  } catch (error) {
    console.error("❌ Error al eliminar usuario:", error);
    res.status(500).json({ ok: false, msg: "Error al eliminar usuario" });
  }
};

module.exports = {
  registrarUsuario,
  loginUsuario,
  actualizarUsuario,
  listarUsuarios,      // ✅ añadido
  obtenerUsuario,      // ✅ añadido
  eliminarUsuario      // ✅ añadido
};
