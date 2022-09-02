const mongoose = require("mongoose")

// Recordar no colocar ninguna propiedad con un nombre que tenga menos de 3 carácteres

const detallesPjSchema = new mongoose.Schema( // Schema nose bien lo que hace pero es una palabra reservada
    {
        habilidades: {
                habilidad1: {type: String, required: true},
                imagen1: {type: String, required: true},
                habilidad2: {type: String, required: true},
                imagen2: {type: String, required: true},
                habilidad3: {type: String, required: true},
                imagen3: {type: String, required: true}
            },
            
        maestro: {type: String, required: true},
        aliados: {type: String, required: true}
    }
)

const detallesPj = mongoose.model("detallespjcols", detallesPjSchema) // el "Personajes", entre comillas "" es el nombre de mi colección dentro de mi base de datos. PersonajesSchema quiere decir que le estoy pasando las propiedades que hice arriba en la const valga la rebundancia, PersonajesSchema

module.exports = detallesPj // acá exporto mi modelo para utilizarlo en los controladores