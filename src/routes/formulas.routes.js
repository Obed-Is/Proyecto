import express from 'express';
import path from 'path';
import { formulasModel } from '../models/formulas.model.js';

const router = express.Router();
const __dirname = import.meta.dirname;

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/formulas.html'));
});

//obtener todas las formulas
router.get('/api/all', async (req, res) => {
    const data = await formulasModel.getFormula();
    res.json(data);
});

router.post('/api/newFormula', async (req, res) => {
    const { nombreFormula, descripcionFormula, tiempoFormula, cantidadProducida, unidadCantidadProducida, materiaPrima } = req.body;

    const newFormula = {
        nombreFormula,
        descripcionFormula,
        tiempoFormula,
        cantidadProducida: `${cantidadProducida} ${unidadCantidadProducida}`,
        materiaPrima
    }

    const faltanCampos = Object.values(newFormula).some(valor => !valor);

    if (faltanCampos) {
        return res.status(400).redirect('/formulas?insercion=error');
    }
    const respuestaInsercion = await formulasModel.addFormula(newFormula);

    if (!respuestaInsercion) {
        return res.status(500).redirect('/formulas?insercion=error');
    }
    console.log("formula insertada: ", newFormula);
    return res.status(201).redirect('/formulas?insercion=exito');
});

router.delete('/api/eliminar/:id', async (req, res) => {
    const { id } = req.params;
    console.log("Id recibido: ", id);

    const confirmacion = await formulasModel.deleteFormula(id);
    if (confirmacion > 0) {
        return res.status(200).json({ mensaje: "Formula eliminada"});
    }else {
        return res.status(404).json({ mensaje: "No se encontró la fórmula" });
    }
});

router.put('/api/actualizar/:id', async (req, res) => {
    const formula = req.body;
    console.log("Formula para actualizar: ", formula);
    const confirmacion = await formulasModel.updateFormula(formula);
    console.log("contador: ", confirmacion)
    if(confirmacion > 1){
        return res.json({ modificacion: true, mensaje: "Formula actualizada correctamente" });
    }else if(confirmacion <= 1){
        return res.json({ modificacion: false, mensaje: "No se modificaron campos para actualizar" });
    }else{
        res.json({ modificacion: false, mensaje: "No se pudo actualizar la formula" });
    }
});

export default router;