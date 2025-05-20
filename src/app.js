import express from 'express';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import router from './routes/routes.js';
import routerFormulas from './routes/formulas.routes.js';
import routerProductos from './routes/productos.routes.js';
import routerProveedores from './routes/proveedores.routes.js';


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

export default app;