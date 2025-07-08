const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verificarToken, soloAdmin } = require('../middlewares/authMiddleware');

// Registro y login (sin protección)
router.post('/register', userController.registrarUsuario);
router.post('/login', userController.loginUsuario);

// Actualizar datos de usuario (requiere login)
router.put('/:id', verificarToken, userController.actualizarUsuario);

// Listar todos los usuarios (solo admin)
router.get('/', verificarToken, soloAdmin, userController.listarUsuarios);

// Obtener un usuario por ID (solo admin)
router.get('/:id', verificarToken, soloAdmin, userController.obtenerUsuario);

// Eliminar usuario (solo admin)
router.delete('/:id', verificarToken, soloAdmin, userController.eliminarUsuario);

module.exports = router;
