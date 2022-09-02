const mongoose = require("mongoose")

// Recordar no colocar ninguna propiedad con un nombre que tenga menos de 3 carácteres

const PersonajesSchema = new mongoose.Schema( // Schema nose bien lo que hace pero es una palabra reservada
    {
        nombre: {type: String, required: true}, // en type puede ser Number, Array, etc. según el tipo de dato que utilice
        aldea: {type: String, required: true},
        especie: {type: String, required: true},
        historia: {type: String, required: true},
        imagen: {type: String, required: true},
        imagen2: {type: String},
        detallesPj: [{type:mongoose.Types.ObjectId, ref: "detallespjcols"}], // hago referencia a la coleccion detallesPjCol, pido que el dato sea tipo ObjectId
        likes: {type:Array}
    }
)

const Personajes = mongoose.model("Personajes", PersonajesSchema) // el "Personajes", entre comillas "" es el nombre de mi colección dentro de mi base de datos. PersonajesSchema quiere decir que le estoy pasando las propiedades que hice arriba en la const valga la rebundancia, PersonajesSchema

module.exports = Personajes // acá exporto mi modelo para utilizarlo en los controladores