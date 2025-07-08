const pool = require('./db');

// Crear un usuario
const crearUsuario = async (usuario) => {
  const { nombre_completo, correo, cedula, sexo, telefono, password, rol } = usuario;
  const result = await pool.query(
    `INSERT INTO usuarios (nombre_completo, correo, cedula, sexo, telefono, password, rol) 
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [nombre_completo, correo, cedula, sexo, telefono, password, rol]
  );
  return result.rows[0];
};

// Buscar usuario por correo
const buscarPorCorreo = async (correo) => {
  const result = await pool.query('SELECT * FROM usuarios WHERE correo = $1', [correo]);
  return result.rows[0];
};

// Actualizar usuario por ID
const actualizarUsuario = async (id, data) => {
  const { nombre_completo, correo, cedula, sexo, telefono } = data;

  const result = await pool.query(
    `UPDATE usuarios 
     SET nombre_completo = $1,
         correo = $2,
         cedula = $3,
         sexo = $4,
         telefono = $5
     WHERE id = $6
     RETURNING *`,
    [nombre_completo, correo, cedula, sexo, telefono, id]
  );

  return result.rows[0] || null;
};

// 🔥 Listar todos los usuarios
const listarUsuarios = async () => {
  const result = await pool.query(
    `SELECT id, nombre_completo, correo, cedula, sexo, telefono, rol
     FROM usuarios
     ORDER BY id ASC`
  );
  return result.rows;
};

// 🕵️‍♂️ Obtener un usuario por ID
const obtenerUsuarioPorId = async (id) => {
  const result = await pool.query(
    `SELECT id, nombre_completo, correo, cedula, sexo, telefono, rol
     FROM usuarios
     WHERE id = $1`,
    [id]
  );
  return result.rows[0];
};

// ❌ Eliminar usuario por ID
const eliminarUsuario = async (id) => {
  const result = await pool.query(
    'DELETE FROM usuarios WHERE id = $1 RETURNING *',
    [id]
  );
  return result.rows[0] || null;
};

module.exports = {
  crearUsuario,
  buscarPorCorreo,
  actualizarUsuario,
  listarUsuarios,      // ✅ añadido
  obtenerUsuarioPorId, // ✅ añadido
  eliminarUsuario      // ✅ añadido
};
