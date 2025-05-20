import app from './app.js';
import { PORT } from './config.js';

//desde aqui se inicia el servidor/web, ademas al importar el config.js se inicializa la conexion a la base de datos
// 2 pajaros de un tiro U_U
app.listen(PORT, () => {
    console.log(`Server activo: http://localhost:${PORT}/productos`);
})