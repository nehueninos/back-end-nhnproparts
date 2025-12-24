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
      'http://localhost:3000',
      'https://nhnproparts.web.app',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }));
app.use(express.json());
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
