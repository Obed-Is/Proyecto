import mongoose from "mongoose";

//se trabaja con una clase para tener mejor orden como cuando usamos php, c# y java
export class productos{

    //se crea un metodo para llamar los productos(es solo un ejemplo de como se puede usar)
    static async getAllProducts(){
        //se obtiene la base de datos y la coleccion, es el db.collection.find() de mongo, pero aqui se debe declarar asi para usarlo
        const db = mongoose.connection.db;
        const coleccion = db.collection("productos");
        try {
            //aqui se hace la consulta se usa async/await ya que es una peticion externa y puede tardar(aunque sean milisegundos)
            const res = await coleccion.find();
            /* se vuelve a usar async/await para obtener el resultado de la consulta, ya que es una promesa y se usa el metodo toArray() para poder verlo
            porque si no, aparece un json del infierno que no se entiende nada xd, quiten el toArray() y pruebenlo */
            const data = await res.toArray();
            console.log(data);
        } catch (error) {
            console.error("error al traer los productos: ", error);
        }
    }

    //aqui se seguiria creando metodos que se ocuparian como uno para insertar, modificar etc..
}