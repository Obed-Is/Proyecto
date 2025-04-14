import express from 'express';
import { productos } from '../models/productos.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = import.meta.dirname;

const router = express.Router();

//esta es una ruta, viene siendo como http://localhost:4000/inicio
router.get('/inicio', (req, res) => {
    //aqui se llama al metodo getAllProduct, que trae todos los productos de la base de datos como un ejemplo de como se puede usar
    productos.getAllProducts();
    //aqui se envia la respuesta al cliente, es solo un ejemplo
    res.sendFile(path.join(__dirname, '../views/ejemplo.html'));
});

//esta ruta seria asi http://localhost:4000/rutaEjemplo
router.get('/rutaEjemplo', (req, res) => {
    //aqui se llama al metodo getAllProduct, que trae todos los productos de la base de datos como un ejemplo de como se puede usar
    //muestra un array vacio en la consola porque no hay registros aun
    productos.getAllProducts();
    //aqui se envia la respuesta al cliente, es solo un ejemplo
    res.send('Ruta de ejemplo');
});

export default router;