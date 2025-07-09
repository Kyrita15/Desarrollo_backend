const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'https://adopciones-frontend.vercel.app', // 👈 añade el dominio de Vercel aquí
];

app.use(cors({
  origin: function (origin, callback) {
    // Permite requests sin origin (como Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());

// 👇 Ruta de prueba
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

// ✅ Puerto dinámico para Vercel o local
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`✅ API de adopciones funcionando en el puerto ${PORT}`);
});
