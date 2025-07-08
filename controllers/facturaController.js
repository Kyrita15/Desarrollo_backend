const facturaModel = require('../models/facturaModel');

// Crear una nueva factura
const crearFactura = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const { carrito, total } = req.body;

    const factura = await facturaModel.crearFactura(usuarioId, carrito, total);

    res.status(201).json({ ok: true, factura });
  } catch (error) {
    console.error("❌ Error al crear factura:", error);
    res.status(500).json({ ok: false, msg: 'Error al crear factura' });
  }
};

// Obtener las facturas del usuario actual
const getMisFacturas = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;

    const facturas = await facturaModel.obtenerFacturasPorUsuario(usuarioId);

    res.json({ ok: true, facturas });
  } catch (error) {
    console.error("❌ Error al obtener facturas del usuario:", error);
    res.status(500).json({ ok: false, msg: 'Error al obtener facturas' });
  }
};

// Obtener todas las facturas (admin)
const getTodasFacturas = async (req, res) => {
  try {
    const facturas = await facturaModel.obtenerTodasFacturas();

    res.json({ ok: true, facturas });
  } catch (error) {
    console.error("❌ Error al obtener todas las facturas:", error);
    res.status(500).json({ ok: false, msg: 'Error al obtener todas las facturas' });
  }
};

// 🆕 Obtener una factura por ID (con detalle de productos)
const getFacturaById = async (req, res) => {
  try {
    const facturaId = req.params.id;

    const factura = await facturaModel.obtenerFacturaPorId(facturaId);

    if (!factura) {
      return res.status(404).json({ ok: false, msg: "Factura no encontrada" });
    }

    res.json({ ok: true, factura });
  } catch (error) {
    console.error("❌ Error al obtener la factura:", error);
    res.status(500).json({ ok: false, msg: 'Error al obtener la factura' });
  }
};

module.exports = {
  crearFactura,
  getMisFacturas,
  getTodasFacturas,
  getFacturaById, // 👈 agregado para detalle
};
