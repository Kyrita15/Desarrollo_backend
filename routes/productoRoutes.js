const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');
const { verificarToken, soloAdmin } = require('../middlewares/authMiddleware');

// Productos
router.get('/', productoController.getProductos);
router.post('/', verificarToken, soloAdmin, productoController.postProducto);
router.put('/:id', verificarToken, soloAdmin, productoController.putProducto);
router.delete('/:id', verificarToken, soloAdmin, productoController.deleteProducto);

module.exports = router;
