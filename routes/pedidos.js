import express from 'express';
import { enviarPedidoEmail } from '../src/services/emailService.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const pedido = req.body;

    await enviarPedidoEmail(pedido);

    res.status(200).json({
      ok: true,
      message: 'Pedido enviado por email'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      message: 'Error enviando el pedido'
    });
  }
});

export default router;
