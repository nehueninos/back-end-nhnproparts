import autenticar from "./auth.js";
import expedientes from "./expedientes.js";
import products from "../models/Product.js";

export const rutas = () => [
    
autenticar,  
products,
expedientes
];