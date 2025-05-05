import express from 'express';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import router from './routes/routes.js';
import routerFormulas from './routes/formulas.routes.js';
import routerProductos from './routes/productos.routes.js';
import routerProveedores from './routes/proveedores.routes.js';

import { Producto } from "./models/producto.model.js";


//inicializacion de express
const app = express();

const __dirname = import.meta.dirname;

//esto es para que el servidor pueda leer archivos estaticos de la carpeta public como css, js, imagenes etc..
app.use(express.static(path.join(__dirname, 'public')));

//middlewares, aqui son funciones que se ejecutan antes de las rutas
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev')); //morgan es un middleware para ver las peticiones que llegan al servidor
app.use(express.json()); //este middleware es para que entienda el json que se envia a traves de un form(html) como un post

//es para las rutas del servidor, se separaran a una carpeta aparte para tener un mejor orden
app.use(router);
app.use(routerFormulas);
app.use(routerProductos);
app.use(routerProveedores);

// Ruta para obtener todos los productos
app.get("/api/productos", async (req, res) => {
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
app.post("/agregarProductos", async (req, res) => {
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
app.put("/api/productos/:id", async (req, res) => {
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
app.delete("/api/productos/:id", async (req, res) => {
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
app.get("/api/productos/buscar", async (req, res) => {
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
app.get("/api/productos/filtrar", async (req, res) => {
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
app.get("/api/productos/ordenar", async (req, res) => {
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

export default app;