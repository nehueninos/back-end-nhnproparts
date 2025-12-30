import { Router } from 'express';
import Product from '../models/Product.js';
import upload from '../middlewares/upload.js';
import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';

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
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, description, category, price, stock } = req.body;

    if (!name || !price || !stock) {
      return res.status(400).json({ message: 'Datos inválidos' });
    }

    let image_url = '';

    // ✅ SUBIR A CLOUDINARY DESDE MEMORIA
    if (req.file) {
      const uploadFromBuffer = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'products' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );

          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });

      const result = await uploadFromBuffer();
      image_url = result.secure_url;
    }

    const product = new Product({
      name,
      description,
      category,
      price,
      stock,
      image_url,
    });

    await product.save();

    res.json(product);
  } catch (err) {
    console.error('🔥 ERROR CREATE PRODUCT:', err);
    res.status(500).json({ message: 'Error creando producto' });
  }
});

// =======================
// UPDATE PRODUCT
// =======================
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.file) {
      const uploadFromBuffer = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'products' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );

          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });

      const result = await uploadFromBuffer();
      updateData.image_url = result.secure_url;
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json(product);
  } catch (err) {
    console.error('🔥 ERROR UPDATE PRODUCT:', err);
    res.status(500).json({ message: 'Error actualizando producto' });
  }
});

// =======================
// DELETE PRODUCT
// =======================
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json({ message: 'Producto eliminado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error eliminando producto' });
  }
});

export default router;
