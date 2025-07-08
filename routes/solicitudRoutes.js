const express = require('express');
const router = express.Router();
const solicitudController = require('../controllers/solicitudController');
const { verificarToken, soloAdmin } = require('../middlewares/authMiddleware');

// Crear solicitud de adopción (usuario)
router.post('/', verificarToken, solicitudController.crearSolicitud);

// Obtener solicitudes del usuario logueado
router.get('/mis-solicitudes', verificarToken, solicitudController.getMisSolicitudes);

// Obtener todas las solicitudes (admin)
router.get('/', verificarToken, soloAdmin, solicitudController.getTodasSolicitudes);

// Aprobar solicitud (admin)
router.patch('/:id/aprobar', verificarToken, soloAdmin, solicitudController.aprobarSolicitud);

// Rechazar solicitud (admin)
router.patch('/:id/rechazar', verificarToken, soloAdmin, solicitudController.rechazarSolicitud);

module.exports = router;
   