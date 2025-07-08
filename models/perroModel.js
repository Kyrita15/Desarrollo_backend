const pool = require('./db');

// Listar todos los perros
const listarPerros = async () => {
  const result = await pool.query('SELECT * FROM perros ORDER BY id ASC');
  return result.rows.map(p => ({
    ...p,
    imagen_url: p.imagen_url || 'https://via.placeholder.com/300x200?text=Sin+foto'
  }));
};

// Crear un nuevo perro
const crearPerro = async (perro) => {
  const { nombre, raza, descripcion, imagen_url, edad } = perro;
  const result = await pool.query(
    `INSERT INTO perros (nombre, raza, descripcion, imagen_url, edad, adoptado) 
     VALUES ($1, $2, $3, $4, $5, false) RETURNING *`,
    [nombre, raza, descripcion, imagen_url, edad]
  );
  return result.rows[0];
};

// Editar perro
const editarPerro = async (id, perro) => {
  const { nombre, raza, descripcion, imagen_url, edad, adoptado } = perro;
  const result = await pool.query(
    `UPDATE perros 
     SET nombre=$1, raza=$2, descripcion=$3, imagen_url=$4, edad=$5, adoptado=$6
     WHERE id=$7 RETURNING *`,
    [nombre, raza, descripcion, imagen_url, edad, adoptado, id]
  );
  if (result.rowCount === 0) {
    throw new Error(`No se encontró el perro con ID ${id}`);
  }
  return result.rows[0];
};

// Eliminar perro
const eliminarPerro = async (id) => {
  const result = await pool.query('DELETE FROM perros WHERE id=$1 RETURNING *', [id]);
  if (result.rowCount === 0) {
    throw new Error(`No se encontró el perro con ID ${id}`);
  }
  return result.rows[0];
};

// Listar perros adoptados por un usuario
const listarAdopcionesPorUsuario = async (usuarioId) => {
  const result = await pool.query(
    `SELECT p.* FROM perros p
     INNER JOIN adopciones a ON p.id = a.perro_id
     WHERE a.usuario_id = $1`,
    [usuarioId]
  );
  return result.rows.map(p => ({
    ...p,
    imagen_url: p.imagen_url || 'https://via.placeholder.com/300x200?text=Sin+foto'
  }));
};

// Marcar perro como adoptado
const adoptarPerro = async (id, usuarioId) => {
  const perro = await pool.query('SELECT * FROM perros WHERE id=$1', [id]);
  if (perro.rowCount === 0) {
    throw new Error(`No existe el perro con ID ${id}`);
  }
  if (perro.rows[0].adoptado) {
    throw new Error(`El perro con ID ${id} ya está adoptado`);
  }

  await pool.query('UPDATE perros SET adoptado=true WHERE id=$1', [id]);
  await pool.query(
    'INSERT INTO adopciones (usuario_id, perro_id, fecha_adopcion) VALUES ($1, $2, NOW())',
    [usuarioId, id]
  );
  return { msg: '¡Has adoptado a este perrito con éxito!' };
};

module.exports = {
  listarPerros,
  crearPerro,
  editarPerro,
  eliminarPerro,
  adoptarPerro,
  listarAdopcionesPorUsuario,
};
