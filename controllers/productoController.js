const productoModel = require('../models/productoModel');

const getProductos = async (req, res) => {
  try {
    const productos = await productoModel.listarProductos();
    res.json({ ok: true, productos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: 'Error al listar productos' });
  }
};

const postProducto = async (req, res) => {
  try {
    const producto = await productoModel.crearProducto(req.body);
    res.status(201).json({ ok: true, producto });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: 'Error al crear producto' });
  }
};

const putProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await productoModel.editarProducto(id, req.body);
    res.json({ ok: true, producto });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: 'Error al actualizar producto' });
  }
};

const deleteProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await productoModel.eliminarProducto(id);
    res.json({ ok: true, producto });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: 'Error al eliminar producto' });
  }
};

module.exports = {
  getProductos,
  postProducto,
  putProducto,
  deleteProducto,
};
