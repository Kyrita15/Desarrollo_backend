const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middlewares/authMiddleware');
const compraController = require('../controllers/compraController');

// Crear compra (usuario)
router.post('/', verificarToken, compraController.crearCompra);

module.exports = router;
