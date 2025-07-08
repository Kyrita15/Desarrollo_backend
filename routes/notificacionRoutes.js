const express = require('express');
const router = express.Router();
const notificacionController = require('../controllers/notificacionController');
const { verificarToken } = require('../middlewares/authMiddleware');

// Obtener notificaciones del usuario
router.get('/', verificarToken, notificacionController.getMisNotificaciones);

// Marcar notificación como leída
router.patch('/:id/leida', verificarToken, notificacionController.marcarLeida);

module.exports = router;
