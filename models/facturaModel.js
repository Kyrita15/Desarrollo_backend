const pool = require('./db');

// Crear factura con detalles
const crearFactura = async (usuarioId, carrito, total) => {
  const resultFactura = await pool.query(
    `INSERT INTO facturas (usuario_id, total)
     VALUES ($1, $2) RETURNING *`,
    [usuarioId, total]
  );

  const facturaId = resultFactura.rows[0].id;

  for (const item of carrito) {
    await pool.query(
      `INSERT INTO detalle_factura (factura_id, producto_id, cantidad, precio_unitario)
       VALUES ($1, $2, $3, $4)`,
      [facturaId, item.producto_id, item.cantidad, item.precio_unitario]
    );

    // Descontar stock
    await pool.query(
      `UPDATE productos SET stock = stock - $1 WHERE id = $2`,
      [item.cantidad, item.producto_id]
    );
  }

  return resultFactura.rows[0];
};

// Ver facturas de un usuario
const obtenerFacturasPorUsuario = async (usuarioId) => {
  const result = await pool.query(
    `SELECT * FROM facturas WHERE usuario_id=$1 ORDER BY fecha DESC`,
    [usuarioId]
  );
  return result.rows;
};

// Ver todas las facturas (admin)
const obtenerTodasFacturas = async () => {
  const result = await pool.query(
    `SELECT f.*, u.nombre_completo FROM facturas f
     JOIN usuarios u ON f.usuario_id = u.id
     ORDER BY f.fecha DESC`
  );
  return result.rows;
};

// 🆕 Obtener una factura con su detalle
const obtenerFacturaPorId = async (facturaId) => {
  const resultFactura = await pool.query(
    `SELECT f.id, f.total, f.fecha, u.nombre_completo
     FROM facturas f
     JOIN usuarios u ON f.usuario_id = u.id
     WHERE f.id = $1`,
    [facturaId]
  );

  if (resultFactura.rows.length === 0) {
    return null; // No encontrada
  }

  const resultDetalle = await pool.query(
    `SELECT df.cantidad, df.precio_unitario, p.nombre
     FROM detalle_factura df
     JOIN productos p ON df.producto_id = p.id
     WHERE df.factura_id = $1`,
    [facturaId]
  );

  return {
    ...resultFactura.rows[0],
    detalle: resultDetalle.rows
  };
};

module.exports = {
  crearFactura,
  obtenerFacturasPorUsuario,
  obtenerTodasFacturas,
  obtenerFacturaPorId, // 👈 Agregado
};
