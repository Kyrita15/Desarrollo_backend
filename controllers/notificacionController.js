const notificacionModel = require('../models/notificacionModel');

// Obtener notificaciones del usuario logueado
const getMisNotificaciones = async (req, res) => {
  const usuarioId = req.usuario.id;
  try {
    const notificaciones = await notificacionModel.obtenerNotificacionesPorUsuario(usuarioId);
    res.json({ ok: true, notificaciones });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: 'Error al obtener notificaciones' });
  }
};

// Marcar notificación como leída
const marcarLeida = async (req, res) => {
  const { id } = req.params;
  try {
    await notificacionModel.marcarComoLeida(id);
    res.json({ ok: true, msg: 'Notificación marcada como leída' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: 'Error al marcar como leída' });
  }
};

module.exports = {
  getMisNotificaciones,
  marcarLeida,
};
