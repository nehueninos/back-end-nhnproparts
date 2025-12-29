import 'dotenv/config';
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import productsRoutes from "./routes/Products.js";
import authRoutes from './routes/auth.js';
import pedidosRouter from './routes/pedidos.js';




const app = express();
app.use(cors({
    origin: [
      'http://localhost:5173', // Vite
      'http://localhost:3000',
      'https://nhnproparts.web.app',
      'https://admin-nhnproparts.web.app',
    ],
    origin: function (origin, callback) {
    // permite requests sin origin (Postman, curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }));
  app.options('*', cors());
  app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

mongoose.set('strictQuery', true);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB conectado"))
  .catch(err => console.error(err));

app.use("/api/products", productsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/pedido', pedidosRouter);

app.listen(3000, () => {
  console.log("Servidor corriendo en puerto 3000");
});
