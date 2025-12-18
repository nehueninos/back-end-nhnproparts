import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  stock: Number,
  image_url: String,
  category: String,
  image: String
});

export default mongoose.model("Product", productSchema);
