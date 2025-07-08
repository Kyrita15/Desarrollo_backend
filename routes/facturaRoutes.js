const express = require('express');
const router = express.Router();
const facturaController = require('../controllers/facturaController');
const { verificarToken, soloAdmin } = require('../middlewares/authMiddleware');

// Crear una factura
router.post('/', verificarToken, facturaController.crearFactura);

// Obtener facturas del usuario actual
router.get('/mis-facturas', verificarToken, facturaController.getMisFacturas);

// Obtener todas las facturas (solo admin)
router.get('/', verificarToken, soloAdmin, facturaController.getTodasFacturas);

// 🆕 Obtener una factura por ID (detalle de productos)
router.get('/:id', verificarToken, facturaController.getFacturaById);

module.exports = router;
