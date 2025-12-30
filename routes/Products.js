import { Router } from 'express';
import Product from '../models/Product.js';
import cloudinary from '../config/cloudinary.js';
import upload from '../middlewares/upload.js';

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

    // 🔥 SUBIDA REAL A CLOUDINARY
    if (req.file) {
      const uploadFromBuffer = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'products' },
            (error, result) => {
              if (result) resolve(result.secure_url);
              else reject(error);
            }
          );

          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });

      image_url = await uploadFromBuffer();
    }

    const product = new Product({
      name,
      description,
      category,
      price: Number(price),
      stock: Number(stock),
      image_url,
    });

    await product.save();
    res.json(product);

  } catch (err) {
    console.error('❌ CREATE PRODUCT ERROR:', err);
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
      price: req.body.price ? Number(req.body.price) : undefined,
      stock: req.body.stock ? Number(req.body.stock) : undefined,
    };

    if (req.file) {
      updateData.image_url = req.file.path;
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json(product);
  } catch (err) {
    console.error('❌ UPDATE PRODUCT ERROR:', err);
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
