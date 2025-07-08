const jwt = require('jsonwebtoken');
require('dotenv').config();

// Verifica si el usuario está autenticado
const verificarToken = (req, res, next) => {
  console.log("Authorization Header:", req.headers['authorization']); // 👈 añade esto

  const token = req.headers['authorization'];
  if (!token) {
    console.log("❌ Token no proporcionado");
    return res.status(401).json({ ok: false, msg: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
    req.usuario = decoded; // Guarda la info del usuario en req
    console.log("✅ Token válido:", decoded);
    next();
  } catch (error) {
    console.log("❌ Error verificando token:", error.message);
    return res.status(403).json({ ok: false, msg: 'Token inválido' });
  }
};


// Permite solo al admin
const soloAdmin = (req, res, next) => {
  if (req.usuario.rol !== 'admin') {
    return res.status(403).json({ ok: false, msg: 'Solo el admin puede realizar esta acción' });
  }
  next();
};

module.exports = {
  verificarToken,
  soloAdmin,
};
