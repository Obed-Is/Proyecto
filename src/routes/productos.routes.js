import express from 'express';
import path from 'path';
import { Producto } from '../models/producto.model.js'; // Importar el modelo Producto

const router = express.Router();
const __dirname = import.meta.dirname;

router.get('/productos', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/productos.html'));
});


// Ruta para obtener todos los productos
router.get("/api/productos", async (req, res) => {
  try {
      const productos = await Producto.find(); // Recupera todos los productos
      console.log(productos); // Verifica en la consola los productos obtenidos
      res.json(productos); // Responde con JSON
  } catch (error) {
      console.error(error);
      res.status(500).send("Error al obtener los productos");
  }
});

// Agregar producto
router.post("/agregarProductos", async (req, res) => {
  try {
    const nuevoProducto = new Producto(req.body);
    await nuevoProducto.save();
    res.send("Producto guardado con éxito"+ "<a href='/productos'>Volver</a>");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al guardar el producto");
  }
});


// Editar producto
router.put("/api/productos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const productoActualizado = await Producto.findByIdAndUpdate(id, req.body, { new: true });
        res.json(productoActualizado);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al editar el producto");
    }
});

// Ruta para eliminar producto
router.delete("/api/productos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await Producto.findByIdAndDelete(id);
        res.send("Producto eliminado con éxito");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al eliminar el producto");
    }
});

// Ruta para buscar productos por número o nombre
router.get("/api/productos/buscar", async (req, res) => {
    const { criterio } = req.query;
    try {
        const productos = await Producto.find({
            $or: [
                { nombre: { $regex: criterio, $options: "i" } },
                { _id: criterio }
            ]
        });
        res.json(productos);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al buscar productos");
    }
});

// Ruta para filtrar productos por proveedor
router.get("/api/productos/filtrar", async (req, res) => {
    const { proveedor } = req.query;
    try {
        const productos = await Producto.find({ proveedor: { $regex: proveedor, $options: "i" } });
        res.json(productos);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al filtrar productos");
    }
});

// Ruta para ordenar productos
router.get("/api/productos/ordenar", async (req, res) => {
    const { criterio } = req.query;
    try {
        const productos = await Producto.find().sort(
            criterio === "precio" ? { precioDetalle: 1 } : { nombre: 1 }
        );
        res.json(productos);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al ordenar productos");
    }
});

export default router;