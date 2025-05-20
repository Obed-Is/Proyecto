import mongoose from "mongoose";

const productoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    precioDetalle: { type: Number, required: true },
    precioPorMayor: { type: Number, required: true },
    cantidadMinina: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    proveedor: { type: String, required: true }
    // Agrega mas campos si se ocupan
});

export const Producto = mongoose.model("Producto", productoSchema);
