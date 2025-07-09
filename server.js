const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ✅ Orígenes permitidos
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173', // Frontend local
  'https://adopciones-frontend.vercel.app',            // Frontend en Vercel
];

// ✅ Configurar CORS
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Permite Postman y CLI sin origin
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());

// ✅ Ruta de prueba
app.get('/', (req, res) => {
  res.send('✅ API de adopciones funcionando 🐶');
});

// ✅ Importar y usar rutas
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

const protectedRoutes = require('./routes/protectedRoutes');
app.use('/api/protected', protectedRoutes);

const perroRoutes = require('./routes/perroRoutes');
app.use('/api/perros', perroRoutes);

const solicitudRoutes = require('./routes/solicitudRoutes');
app.use('/api/solicitudes', solicitudRoutes);

const productoRoutes = require('./routes/productoRoutes');
app.use('/api/productos', productoRoutes);

const facturaRoutes = require('./routes/facturaRoutes');
app.use('/api/facturas', facturaRoutes);

const notificacionRoutes = require('./routes/notificacionRoutes');
app.use('/api/notificaciones', notificacionRoutes);

const compraRoutes = require('./routes/compraRoutes');
app.use('/api/compras', compraRoutes);

// ✅ Exportar app para Vercel (no usar app.listen en Vercel)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`✅ API de adopciones corriendo en http://localhost:${PORT}`);
  });
}

module.exports = app;
