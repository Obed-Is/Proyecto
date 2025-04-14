import mongoose from 'mongoose';
import 'dotenv/config';

//aunque parezca que el import dotenv/config no se usa, es necesario para que se carguen las variables de entorno xd
export const PORT = process.env.PORT || 3000;

//aqui se hace la conexion a mongo, solo es necesario hacerla 1 vez ya que es tomada globalmente al llamarse en el index.js
mongoose.connect(process.env.DATABASE_URL)
    .then(() => console.log("La conexion a mongo es exitosa"))
    .catch((err) => console.error("Ocurrio un error al conectar a mongo: ", err))

