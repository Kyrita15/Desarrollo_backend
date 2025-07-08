const pool = require('./db');

// Crear nueva solicitud
const crearSolicitud = async (usuarioId, perroId, mensaje) => {
  const result = await pool.query(
    `INSERT INTO solicitudes (usuario_id, perro_id, mensaje)
     VALUES ($1, $2, $3) RETURNING *`,
    [usuarioId, perroId, mensaje]
  );
  return result.rows[0];
};

// Obtener todas las solicitudes (solo admin)
const obtenerSolicitudes = async () => {
  const result = await pool.query(
    `SELECT s.*, u.nombre_completo AS usuario_nombre, p.nombre AS perro_nombre
     FROM solicitudes s
     JOIN usuarios u ON s.usuario_id = u.id
     JOIN perros p ON s.perro_id = p.id
     ORDER BY s.fecha_solicitud DESC`
  );
  return result.rows;
};

// Obtener solicitudes de un usuario
const obtenerSolicitudesPorUsuario = async (usuarioId) => {
  const result = await pool.query(
    `SELECT s.*, p.nombre AS perro_nombre
     FROM solicitudes s
     JOIN perros p ON s.perro_id = p.id
     WHERE s.usuario_id = $1
     ORDER BY s.fecha_solicitud DESC`,
    [usuarioId]
  );
  return result.rows;
};

// Cambiar estado de solicitud y traer datos completos
const actualizarEstadoSolicitud = async (id, estado) => {
  const result = await pool.query(
    `UPDATE solicitudes
     SET estado = $1
     WHERE id = $2
     RETURNING *,
       (SELECT usuario_id FROM solicitudes WHERE id = $2) AS usuario_id,
       (SELECT nombre FROM perros WHERE id = solicitudes.perro_id) AS perro_nombre`,
    [estado, id]
  );
  return result.rows[0];
};

// Marcar al perro como adoptado
const marcarPerroComoAdoptado = async (perroId) => {
  try {
    const result = await pool.query(
      `UPDATE perros SET adoptado = true WHERE id = $1 RETURNING *`,
      [perroId]
    );

    if (result.rowCount === 0) {
      console.log(`❌ No se encontró el perro con ID: ${perroId}`);
      return null;
    }

    console.log("✅ Perro marcado como adoptado en la base de datos:", result.rows[0]);
    return result.rows[0];
  } catch (error) {
    console.error("❌ Error al marcar perro como adoptado:", error);
    throw error; // Propaga el error al controlador
  }
};


module.exports = {
  crearSolicitud,
  obtenerSolicitudes,
  obtenerSolicitudesPorUsuario,
  actualizarEstadoSolicitud,
  marcarPerroComoAdoptado,
};
