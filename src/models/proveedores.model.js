import mongoose from "mongoose";

export default class proveedorModel {

    async obtenerProveedores() {
        const db = mongoose.connection.db;
        const coleccion = db.collection('proveedores');

        try {
            const peticion = coleccion.find().sort({ _id: -1 });
            const respuesta = await peticion.toArray();
            return respuesta;
        } catch (error) {
            console.log('Error desde obtener proveedores, desde modelss: ', error);
            return false;
        }
    }

    async nuevoProveedor(proveedor) {
        const db = mongoose.connection.db;
        const coleccion = db.collection('proveedores');

        const duplicados = await this.evitarProveedorDuplicado(proveedor.nombre, proveedor.contacto.valor, 1);
        console.log('Proveedores duplicados: ', await duplicados)

        if (duplicados > 0) {
            return 'Ya existe un proveedor con el mismo nombre o contacto, ingrese uno diferente';
        } else {
            try {
                const peticion = coleccion.insertOne(proveedor);
                const respuesta = await peticion;
                console.log('Proveedor insertado: ', respuesta);
                return respuesta.acknowledged;
            } catch (error) {
                console.log('Error desde nuevo proveedor, desde models: ', error);
                return false;
            }
        }
    }

    async evitarProveedorDuplicado(nombre, contacto, idProveedor) {
        const db = mongoose.connection.db;
        const coleccion = db.collection('proveedores');

        try {
            const peticion = coleccion.find({
                $and: [
                    {
                        $or: [
                            { nombre: nombre },
                            { 'contacto.valor': contacto }
                        ]
                    },
                    { _id : { $ne: new mongoose.Types.ObjectId(idProveedor) } }
                ]
            });
            const respuesta = (await peticion.toArray()).length;
            return respuesta;
        } catch (error) {
            console.log('Error al buscar proveedor duplicado: ', error);
            return false;
        }
    }

    async eliminarProveedor(idProveedor) {
        const db = mongoose.connection.db;
        const coleccion = db.collection('proveedores');

        try {
            const peticion = coleccion.deleteOne({ _id: new mongoose.Types.ObjectId(idProveedor) });
            const respuesta = await peticion;
            console.log('Respuesta del proveedor eliminado: ', respuesta);
            return respuesta.deletedCount;
        } catch (error) {
            console.log('Error al intentar eliminar el proveedor: ', error);
            return 0;
        }
    }

    async modificarProveedor(idProveedor, proveedorData) {
        const db = mongoose.connection.db;
        const coleccion = db.collection('proveedores');

        const duplicados = await this.evitarProveedorDuplicado(proveedorData.nombre, proveedorData.contacto.valor, idProveedor);
        console.log('Duplicados ', duplicados)

        if (duplicados > 0) {
            return -1;
        } else {
            try {
                const peticion = coleccion.updateOne({ _id: new mongoose.Types.ObjectId(idProveedor) }, { $set: proveedorData });
                const respuesta = await peticion;
                console.log('Proveedor actualizado respuesta: ', respuesta);
                return respuesta.modifiedCount + respuesta.matchedCount;
            } catch (error) {
                console.log('Error desde actualizar proveedor, desde models: ', error);
                return false;
            }
        }
    }
}