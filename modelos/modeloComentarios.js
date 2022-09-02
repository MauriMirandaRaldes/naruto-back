const mongoose = require("mongoose")

// Recordar no colocar ninguna propiedad con un nombre que tenga menos de 3 carácteres

const ComentariosSchema = new mongoose.Schema( // Schema nose bien lo que hace pero es una palabra reservada
    {
        texto: {type: String, required: true}, // en type puede ser Number, Array, etc. según el tipo de dato que utilice
        fecha: {type: String},
        creador: {type: String},
        foto: {type: String}
    }
)

const Comentarios = mongoose.model("Comentarios", ComentariosSchema)

module.exports = Comentarios // acá exporto mi modelo para utilizarlo en los controladores