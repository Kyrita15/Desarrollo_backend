const perroModel = require('../models/perroModel');

// GET: Listar perros
const getPerros = async (req, res) => {
  try {
    const perros = await perroModel.listarPerros();
    res.json({ ok: true, perros });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: 'Error al listar perros' });
  }
};

// POST: Crear perro (admin)
const postPerro = async (req, res) => {
  try {
    const nuevoPerro = await perroModel.crearPerro(req.body);
    res.status(201).json({ ok: true, perro: nuevoPerro });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: 'Error al crear perro' });
  }
};

// PUT: Editar perro (admin)
const putPerro = async (req, res) => {
  const { id } = req.params;
  try {
    const perroActualizado = await perroModel.editarPerro(id, req.body);
    res.json({ ok: true, perro: perroActualizado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: 'Error al actualizar perro' });
  }
};

// DELETE: Eliminar perro (admin)
const deletePerro = async (req, res) => {
  const { id } = req.params;
  try {
    const perroEliminado = await perroModel.eliminarPerro(id);
    res.json({ ok: true, perro: perroEliminado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: 'Error al eliminar perro' });
  }
};

// Ver los perros adoptados por un usuario
const getMisAdopciones = async (req, res) => {
  const usuarioId = req.usuario.id; // Viene del middleware
  try {
    const adopciones = await perroModel.listarAdopcionesPorUsuario(usuarioId);
    res.json({ ok: true, perros: adopciones });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: 'Error al obtener las adopciones' });
  }
};

// PATCH: Adoptar perro (usuario)
const adoptarPerro = async (req, res) => {
  const { id } = req.params;
  const usuarioId = req.usuario.id; // Viene del middleware
  try {
    await perroModel.adoptarPerro(id, usuarioId);
    res.json({ ok: true, msg: '¡Has adoptado a este perrito! 🐾' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: 'Error al adoptar perro' });
  }
};

module.exports = {
  getPerros,
  postPerro,
  putPerro,
  deletePerro,
  adoptarPerro,
   getMisAdopciones, 
};
