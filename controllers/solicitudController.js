const solicitudModel = require('../models/solicitudModel');
const notificacionModel = require('../models/notificacionModel');

// Crear solicitud
const crearSolicitud = async (req, res) => {
  const usuarioId = req.usuario.id;
  const { perro_id, mensaje } = req.body;

  try {
    const nuevaSolicitud = await solicitudModel.crearSolicitud(usuarioId, perro_id, mensaje);
    res.status(201).json({ ok: true, solicitud: nuevaSolicitud });
  } catch (error) {
    console.error("❌ Error al crear la solicitud:", error);
    res.status(500).json({ ok: false, msg: 'Error al crear la solicitud' });
  }
};

// Obtener todas las solicitudes (admin)
const getTodasSolicitudes = async (req, res) => {
  try {
    const solicitudes = await solicitudModel.obtenerSolicitudes();
    res.json({ ok: true, solicitudes });
  } catch (error) {
    console.error("❌ Error al obtener solicitudes:", error);
    res.status(500).json({ ok: false, msg: 'Error al obtener solicitudes' });
  }
};

// Obtener solicitudes de un usuario
const getMisSolicitudes = async (req, res) => {
  const usuarioId = req.usuario.id;
  try {
    const solicitudes = await solicitudModel.obtenerSolicitudesPorUsuario(usuarioId);
    res.json({ ok: true, solicitudes });
  } catch (error) {
    console.error("❌ Error al obtener tus solicitudes:", error);
    res.status(500).json({ ok: false, msg: 'Error al obtener tus solicitudes' });
  }
};

const aprobarSolicitud = async (req, res) => {
  const { id } = req.params;
  try {
    console.log(`📥 Aprobando solicitud ID: ${id}`);

    // Cambia estado de la solicitud
    const solicitud = await solicitudModel.actualizarEstadoSolicitud(id, 'aprobada');
    console.log("✅ Estado de la solicitud actualizado:", solicitud);

    if (!solicitud) {
      console.log("❌ Solicitud no encontrada");
      return res.status(404).json({ ok: false, msg: 'Solicitud no encontrada' });
    }

    // 🔥 Try/catch para marcar perro como adoptado
    try {
      const perroActualizado = await solicitudModel.marcarPerroComoAdoptado(solicitud.perro_id);
      console.log("✅ Perro marcado como adoptado:", perroActualizado);
      if (!perroActualizado) {
        console.log("❌ No se pudo marcar el perro como adoptado");
        return res.status(500).json({ ok: false, msg: 'No se pudo marcar el perro como adoptado' });
      }
    } catch (err) {
      console.error("❌ Error al marcar perro como adoptado:", err);
      return res.status(500).json({ ok: false, msg: 'Error al marcar perro como adoptado' });
    }

    // 🔥 Try/catch para crear notificación
    try {
      const mensaje = `🎉 Felicidades! Has sido aprobado para adoptar a ${solicitud.perro_nombre}`;
      const notificacion = await notificacionModel.crearNotificacion(solicitud.usuario_id, mensaje);
      console.log("✅ Notificación creada:", notificacion);
    } catch (err) {
      console.error("❌ Error al crear notificación:", err);
      return res.status(500).json({ ok: false, msg: 'Error al crear la notificación' });
    }

    res.json({ ok: true, msg: 'Solicitud aprobada correctamente', solicitud });
  } catch (error) {
    console.error("❌ Error general en aprobarSolicitud:", error);
    res.status(500).json({ ok: false, msg: 'Error al aprobar la solicitud' });
  }
};



// Rechazar solicitud (admin)
const rechazarSolicitud = async (req, res) => {
  const { id } = req.params;
  try {
    const solicitud = await solicitudModel.actualizarEstadoSolicitud(id, 'rechazada');
    console.log("✅ Datos de la solicitud rechazada:", solicitud);

    if (!solicitud) {
      return res.status(404).json({ ok: false, msg: 'Solicitud no encontrada' });
    }

    // Crear notificación para el usuario
    const mensaje = `😢 Lo sentimos, tu solicitud para ${solicitud.perro_nombre} ha sido rechazada.`;
    await notificacionModel.crearNotificacion(solicitud.usuario_id, mensaje);

    res.json({ ok: true, msg: mensaje, solicitud });
  } catch (error) {
    console.error("❌ Error al rechazar la solicitud:", error);
    res.status(500).json({ ok: false, msg: 'Error al rechazar la solicitud' });
  }
};

module.exports = {
  crearSolicitud,
  getTodasSolicitudes,
  getMisSolicitudes,
  aprobarSolicitud,
  rechazarSolicitud,
};
