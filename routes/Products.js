import { Router } from 'express';
import Product from '../models/Product.js';

const router = Router();

// =======================
// GET ALL PRODUCTS
// =======================
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error obteniendo productos' });
  }
});

// =======================
// CREATE PRODUCT
// =======================
router.post('/', async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      price,
      stock,
      image_url,
    } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: 'Datos inválidos' });
    }

    const product = new Product({
      name,
      description,
      category,
      price,
      stock,
      image_url: image_url || '',
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error('CREATE PRODUCT ERROR:', err);
    res.status(500).json({ message: 'Error creando producto' });
  }
});

// =======================
// UPDATE PRODUCT
// =======================
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json(product);
  } catch (err) {
    console.error('UPDATE PRODUCT ERROR:', err);
    res.status(500).json({ message: 'Error actualizando producto' });
  }
});

// =======================
// DELETE PRODUCT
// =======================
router.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json({ message: 'Producto eliminado correctamente' });
  } catch (err) {
    console.error('DELETE PRODUCT ERROR:', err);
    res.status(500).json({ message: 'Error eliminando producto' });
  }
});

export default router;
