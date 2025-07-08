const pool = require('./db');

// CRUD Productos
const listarProductos = async () => {
  const result = await pool.query('SELECT * FROM productos ORDER BY id ASC');
  return result.rows;
};

const crearProducto = async (producto) => {
  const { nombre, descripcion, imagen_url, precio, stock } = producto;
  const result = await pool.query(
    `INSERT INTO productos (nombre, descripcion, imagen_url, precio, stock)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [nombre, descripcion, imagen_url, precio, stock]
  );
  return result.rows[0];
};

const editarProducto = async (id, producto) => {
  const { nombre, descripcion, imagen_url, precio, stock } = producto;
  const result = await pool.query(
    `UPDATE productos SET
     nombre=$1, descripcion=$2, imagen_url=$3, precio=$4, stock=$5
     WHERE id=$6 RETURNING *`,
    [nombre, descripcion, imagen_url, precio, stock, id]
  );
  return result.rows[0];
};

const eliminarProducto = async (id) => {
  const result = await pool.query('DELETE FROM productos WHERE id=$1 RETURNING *', [id]);
  return result.rows[0];
};

module.exports = {
  listarProductos,
  crearProducto,
  editarProducto,
  eliminarProducto,
};
