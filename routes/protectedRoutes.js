const express = require('express');
const router = express.Router();
const { verificarToken, soloAdmin } = require('../middlewares/authMiddleware');

// Ruta protegida para usuarios autenticados
router.get('/usuario', verificarToken, (req, res) => {
  res.json({
    ok: true,
    msg: `Hola ${req.usuario.correo}, estás autenticado.`,
    usuario: req.usuario,
  });
});

// Ruta protegida solo para admin
router.get('/admin', verificarToken, soloAdmin, (req, res) => {
  res.json({
    ok: true,
    msg: `Hola admin ${req.usuario.correo}, tienes acceso total.`,
  });
});

module.exports = router;
