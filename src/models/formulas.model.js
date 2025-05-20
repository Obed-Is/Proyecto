import mongoose from "mongoose";

export class formulasModel {

    static async addFormula(formula){
        const db = mongoose.connection.db;
        const coleccion = db.collection("formulas");

        try {
            const res = await coleccion.insertOne(formula);
            return res.acknowledged;
        } catch (error) {
            console.log("error al insertar la formula: ", error);
            return false;
        }
    }

    static async getFormula(){
        const db = mongoose.connection.db;
        const coleccion = db.collection("formulas");

        try {
            //el sort es para ordenarlos desde el mas reciente
            const res = await coleccion.find().sort({_id: -1});
            const data = await res.toArray();
            // console.log(data);            
            return data;
        } catch (error) {
            console.log(error);
            return;
        }
    }

    static async deleteFormula(IDformula){
        const db = mongoose.connection.db;
        const coleccion = db.collection("formulas");

        try {
            const res = await coleccion.deleteOne({ _id: new mongoose.Types.ObjectId(IDformula) });
            console.log("eliminado correctamente: ", res);
            return res.deletedCount;
        } catch (error) {
            console.log(error)
        }
    }

    static async updateFormula(formula){
        const db = mongoose.connection.db;
        const coleccion = db.collection("formulas");

        try {
            const res = await coleccion.updateOne({ _id: new mongoose.Types.ObjectId(formula.idFormula) }, {$set: formula});
            console.log("Respuesta de mogno actualizando: ",res)
            return res.modifiedCount + res.matchedCount;
        } catch (error) {
            console.log(error)
        }
    }
}