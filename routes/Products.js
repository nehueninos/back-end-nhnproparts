import { Router } from "express";
import Product from "../models/Product.js";
import upload from '../middlewares/upload.js';

const router = Router();

router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

router.post('/', upload.single('image'), async (req, res) => {
  const product = new Product({
    ...req.body,
    image_url: req.file.path, // URL HTTPS Cloudinary
  });

  await product.save();
  res.json(product);
});

router.put('/:id', upload.single('image'), async (req, res) => {
  const updateData = { ...req.body };

  if (req.file) {
    updateData.image_url = req.file.path;
  }

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true }
  );

  res.json(product);
});

router.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error eliminando producto' });
  }
});

export default router;
