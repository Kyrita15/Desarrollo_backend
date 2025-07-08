const pool = require('./db');

// Crear notificación
const crearNotificacion = async (usuarioId, mensaje) => {
  const result = await pool.query(
    `INSERT INTO notificaciones (usuario_id, mensaje)
     VALUES ($1, $2) RETURNING *`,
    [usuarioId, mensaje]
  );
  return result.rows[0];
};

// Obtener notificaciones de un usuario
const obtenerNotificacionesPorUsuario = async (usuarioId) => {
  const result = await pool.query(
    `SELECT * FROM notificaciones
     WHERE usuario_id = $1
     ORDER BY fecha DESC`,
    [usuarioId]
  );
  return result.rows;
};

// Marcar notificación como leída
const marcarComoLeida = async (id) => {
  await pool.query(
    `UPDATE notificaciones SET leido = true WHERE id = $1`,
    [id]
  );
};

module.exports = {
  crearNotificacion,
  obtenerNotificacionesPorUsuario,
  marcarComoLeida,
};
