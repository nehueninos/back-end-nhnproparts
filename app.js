import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import productsRoutes from './routes/Products.js';
import authRoutes from './routes/auth.js';
import pedidosRouter from './routes/pedidos.js';

const app = express();

// =======================
// CORS CONFIG (GLOBAL)
// =======================
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://nhnproparts.web.app',
  'https://admin-nhnproparts.web.app',
];

app.use(cors({
  origin: (origin, callback) => {
    // Permite requests sin origin (Postman, curl, Render healthcheck)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// 🔥 PRE-FLIGHT (OBLIGATORIO)
app.options('*', cors());

// =======================
// BODY PARSERS
// =======================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// =======================
// MONGODB
// =======================
mongoose.set('strictQuery', true);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error('Mongo error:', err));

// =======================
// ROUTES
// =======================
app.use('/api/products', productsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/pedido', pedidosRouter);

app.use((err, req, res, next) => {
  console.error('🔥 MULTER / UPLOAD ERROR:', err);
  res.status(400).json({
    message: 'Upload error',
    error: err.message,
  });
});
// =======================
// SERVER
// =======================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
