const facturaModel = require('../models/facturaModel');

const crearCompra = async (req, res) => {
  const usuarioId = req.usuario.id;
  const { productos } = req.body;

  try {
    // ⚡ Calcular subtotal y total
    let subtotal = 0;
    const carrito = productos.map((item) => {
      const precioUnitario = Number(item.precio) / 1.15; // quitar IVA
      subtotal += precioUnitario * item.cantidad;

      return {
        producto_id: item.id,
        cantidad: item.cantidad,
        precio_unitario: precioUnitario,
      };
    });

    const iva = subtotal * 0.15;
    const total = subtotal + iva;

    // ✅ Crear factura y detalle
    const nuevaFactura = await facturaModel.crearFactura(usuarioId, carrito, total);

    res.status(201).json({
      ok: true,
      msg: 'Compra realizada con éxito',
      factura: nuevaFactura,
    });
  } catch (error) {
    console.error('❌ Error al procesar la compra:', error);
    res.status(500).json({
      ok: false,
      msg: 'Error al procesar la compra',
    });
  }
};

module.exports = {
  crearCompra,
};
