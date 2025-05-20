import express from 'express';
import path from 'path';
import proveedorModel from '../models/proveedores.model.js';

const routerProveedores = express.Router();
const provModel = new proveedorModel();
const __dirname = import.meta.dirname;

routerProveedores.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/proveedores.html'));
})

routerProveedores.get('/api/obtenerProveedores', async (req, res) => {
    const peticion = await provModel.obtenerProveedores();

    if (peticion === false) {
        res.json({ success: false });
    }
    res.json(peticion);
})

routerProveedores.post('/api/nuevoProveedor', async (req, res) => {
    console.log('Data del nuevo proveedor', req.body);

    const respuestaInsercion = await provModel.nuevoProveedor(req.body);

    if (respuestaInsercion === true) {
        return res.json({ message: "Proveedor registrado exitosamente", success: respuestaInsercion });
    } else if (respuestaInsercion === false) {
        res.json({ message: "Ocurrio un error al intentar agregar el proveedor", success: respuestaInsercion });
    } else {
        res.json({ message: respuestaInsercion, success: false });
    }
})

routerProveedores.delete('/api/eliminar/:id', async (req, res) => {
    const idProveedor = req.params.id;
    console.log('Id del proveedor a eliminar; ', idProveedor);

    const respuestaEliminar = await provModel.eliminarProveedor(idProveedor);

    if (respuestaEliminar != 1) {
        return res.json({ message: 'Ocurrio un error al eliminar el proveedor', success: false });
    }
    return res.json({ message: 'El proveedor ha sido eliminado correctamente', success: true });
})

routerProveedores.put('/api/actualizar/:id', async (req, res) => {
    const idProveedor = req.params.id;
    const proveedorData = req.body;

    const respuestaModificar = await provModel.modificarProveedor(idProveedor, proveedorData);

    if (respuestaModificar == 2) {
        return res.json({ message: 'Proveedor actualizado correctamente', success : true });
    }else if(respuestaModificar == -1){
        return res.json({ message: 'Ya existe un proveedor con el mismo nombre o contacto', success : false });
    }else if(respuestaModificar == 1){
        return res.json({ message: 'No se modificaron campos para actualizar', success : false });
    }
    return res.json({ message: 'Ocurrio un error al intentar actualizar el proveedor', success : false });
})
export default routerProveedores;