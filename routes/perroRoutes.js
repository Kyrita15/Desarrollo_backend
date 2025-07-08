const express = require('express');
const router = express.Router();
const perroController = require('../controllers/perroController');
const { verificarToken, soloAdmin } = require('../middlewares/authMiddleware');

// Ver perros adoptados por el usuario logueado (primero)
router.get('/mis-adopciones', verificarToken, perroController.getMisAdopciones);

// Listar perros (público)
router.get('/', perroController.getPerros);

// Crear perro (solo admin)
router.post('/', verificarToken, soloAdmin, perroController.postPerro);

// Editar perro (solo admin)
router.put('/:id', verificarToken, soloAdmin, perroController.putPerro);

// Eliminar perro (solo admin)
router.delete('/:id', verificarToken, soloAdmin, perroController.deletePerro);

// Adoptar perro (usuario normal)
router.patch('/:id/adoptar', verificarToken, perroController.adoptarPerro);


module.exports = router;
