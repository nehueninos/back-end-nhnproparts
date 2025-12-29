import { Router } from 'express';
import Product from '../models/Product.js';
import upload from '../middlewares/upload.js';

const router = Router();

// =======================
// GET ALL PRODUCTS
// =======================
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error('ERROR GET PRODUCTS:', error);
    res.status(500).json({ message: 'Error obteniendo productos' });
  }
});

// =======================
// CREATE PRODUCT
// =======================
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const productData = {
      ...req.body,
    };

    // ✔️ solo si hay imagen
    if (req.file) {
      productData.image_url = req.file.path; // Cloudinary URL
    }

    const product = new Product(productData);
    await product.save();

    res.json(product);
  } catch (error) {
    console.error('ERROR CREATE PRODUCT:', error);
    res.status(500).json({ message: 'Error creando producto' });
  }
});

// =======================
// UPDATE PRODUCT
// =======================
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const updateData = {
      ...req.body,
    };

    // ✔️ solo si hay imagen nueva
    if (req.file) {
      updateData.image_url = req.file.path;
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
  } catch (error) {
    console.error('ERROR UPDATE PRODUCT:', error);
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
  } catch (error) {
    console.error('ERROR DELETE PRODUCT:', error);
    res.status(500).json({ message: 'Error eliminando producto' });
  }
});

export default router;
